import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert technical recruiter and career coach.
        The user has uploaded their resume and wants to achieve this career goal: "${targetGoal}".
        Analyze the provided resume against this target role. Identify the missing skills required to achieve this goal, and provide actionable recommendations to bridge the gap.
        
        Return strictly a JSON object matching this EXACT structure:
        {
          "missingSkills": [
            { "name": "Skill Name", "category": "Frontend | Backend | DevOps | Architecture | Other", "importance": "High" | "Medium" | "Low" }
          ],
          "recommendations": [
            { "title": "Recommendation Title", "description": "Short specific details", "type": "course" | "project" | "practice" }
          ]
        }
        
        Provide 3-5 missing skills and 3-5 recommendations.
        Respond ONLY with the raw JSON object. No markdown wrappers, no backticks.
        `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type || "application/pdf"
                }
            },
            prompt
        ]);

        const responseText = result.response.text();
        const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        
        const analysisResult = JSON.parse(jsonStr);

        return NextResponse.json(analysisResult, { status: 200 });

    } catch (error) {
        console.error("Resume Analysis Error:", error);
        return NextResponse.json({ message: "Failed to analyze resume. Please check if the file format is supported and try again." }, { status: 500 });
    }
}
