import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateWithGroqVision } from "@/lib/ai/groq";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/** Helper: check if an error is a rate-limit / unavailable error */
const isGeminiExhausted = (err: any): boolean =>
    err?.status === 429 ||
    err?.status === 503 ||
    err?.message?.includes("429") ||
    err?.message?.includes("503") ||
    err?.message?.includes("overloaded") ||
    err?.message?.includes("high demand") ||
    err?.message?.includes("RESOURCE_EXHAUSTED");

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File;
        const targetGoal = formData.get("targetGoal") as string;

        if (!file || !targetGoal) {
            return NextResponse.json({ message: "Resume file and target goal are required." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString("base64");

        // Model fallback chain — try each until one succeeds
        const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

        const prompt = `
        You are an expert technical recruiter and career coach.
        The user has uploaded their resume and wants to achieve this career goal: "${targetGoal}".
        Analyze the provided resume against this target role. Identify the missing skills required to achieve this goal, provide actionable recommendations to bridge the gap, and evaluate the resume's current standing across key skill categories.
        
        Return strictly a JSON object matching this EXACT structure:
        {
          "missingSkills": [
            { "name": "Skill Name", "category": "Frontend | Backend | DevOps | Architecture | Other", "importance": "High" | "Medium" | "Low" }
          ],
          "recommendations": [
            { "title": "Recommendation Title", "description": "Short specific details", "type": "course" | "project" | "practice" }
          ],
          "currentStanding": {
            "overallScore": 65,
            "level": "Intermediate",
            "categories": [
              { "name": "Frontend", "score": 75, "maxScore": 100 },
              { "name": "Backend", "score": 50, "maxScore": 100 },
              { "name": "DevOps", "score": 30, "maxScore": 100 },
              { "name": "Soft Skills", "score": 70, "maxScore": 100 },
              { "name": "Tools & Ecosystem", "score": 60, "maxScore": 100 },
              { "name": "Architecture", "score": 40, "maxScore": 100 }
            ]
          }
        }
        
        For "currentStanding":
        - Evaluate the resume's demonstrated proficiency in each category on a 0-100 scale based on experience, projects, and skills listed.
        - "overallScore" should be a weighted average reflecting how well the resume matches the target goal (0-100).
        - "level" should be one of: "Beginner", "Intermediate", "Advanced", "Expert".
        - Always include all 6 categories even if the score is 0.
        
        Provide 3-5 missing skills and 3-5 recommendations.
        Respond ONLY with the raw JSON object. No markdown wrappers, no backticks.
        `;

        const contentPayload = [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type || "application/pdf"
                }
            },
            prompt
        ];

        // --- Try each Gemini model in the fallback chain with retries ---
        let lastError: any = null;
        let geminiExhausted = false;

        for (const modelName of MODEL_CHAIN) {
            const model = genAI.getGenerativeModel({ model: modelName });

            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    console.log(`[Resume] Trying Gemini model: ${modelName} (attempt ${attempt + 1})`);
                    const result = await model.generateContent(contentPayload);
                    const responseText = result.response.text();
                    const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
                    const analysisResult = JSON.parse(jsonStr);
                    return NextResponse.json(analysisResult, { status: 200 });
                } catch (err: any) {
                    lastError = err;
                    if (isGeminiExhausted(err)) {
                        geminiExhausted = true;
                    }
                    const isRetryable = isGeminiExhausted(err);
                    if (isRetryable && attempt < 1) {
                        const delay = (attempt + 1) * 3000;
                        await new Promise((r) => setTimeout(r, delay));
                        continue;
                    }
                    break; // Move to next model
                }
            }
        }

        // --- Fallback to Groq if Gemini is exhausted ---
        if (geminiExhausted) {
            try {
                console.log("[Resume] Gemini exhausted — falling back to Groq");
                const groqResponse = await generateWithGroqVision(
                    prompt,
                    base64Data,
                    file.type || "application/pdf"
                );
                const jsonStr = groqResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
                const analysisResult = JSON.parse(jsonStr);
                return NextResponse.json(analysisResult, { status: 200 });
            } catch (groqErr: any) {
                console.error("[Resume] Groq fallback also failed:", groqErr);
                return NextResponse.json(
                    { message: "All AI services are currently unavailable. Please try again later." },
                    { status: 503 }
                );
            }
        }

        // All models failed — provide specific error messages
        const is429 = lastError?.status === 429 || lastError?.message?.includes("429");
        const is503 = lastError?.status === 503 || lastError?.message?.includes("503") || lastError?.message?.includes("high demand");

        if (is429) {
            return NextResponse.json(
                { message: "API quota exceeded. Your free-tier daily limit has been reached. Please wait a few minutes or upgrade your Gemini API plan." },
                { status: 429 }
            );
        }
        if (is503) {
            return NextResponse.json(
                { message: "AI service is temporarily overloaded. Please wait a moment and try again." },
                { status: 503 }
            );
        }

        console.error("Resume Analysis Error:", lastError);
        return NextResponse.json({ message: "Failed to analyze resume. Please check if the file format is supported and try again." }, { status: 500 });

    } catch (error: any) {
        console.error("Resume Analysis Error:", error);
        return NextResponse.json({ message: "Failed to analyze resume. Please try again." }, { status: 500 });
    }
}
