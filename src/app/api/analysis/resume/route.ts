import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { generateWithGroqVision as runWithFallbackMultimodal } from "@/lib/ai";

export async function POST(req: Request) {
    const session = await auth();
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

        const responseText = await runWithFallbackMultimodal(
            prompt,
            base64Data,
            file.type || "application/pdf",
        );

        const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const analysisResult = JSON.parse(jsonStr);
        return NextResponse.json(analysisResult, { status: 200 });

    } catch (error: any) {
        console.error("Resume Analysis Error:", error);

        const is429 = error?.status === 429 || error?.message?.includes("429");
        const is503 = error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand");

        if (is429) {
            return NextResponse.json(
                { message: "API quota exceeded. Your free-tier daily limit has been reached. Please wait a few minutes or upgrade your Gemini API plan." },
                { status: 429 },
            );
        }
        if (is503) {
            return NextResponse.json(
                { message: "AI service is temporarily overloaded. Please wait a moment and try again." },
                { status: 503 },
            );
        }

        return NextResponse.json({ message: "Failed to analyze resume. Please try again." }, { status: 500 });
    }
}
