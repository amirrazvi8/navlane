import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnected from "@/lib/db";
import Roadmap from "@/models/Roadmap";

import { generateQuizWithAI } from "@/lib/ai";

// In-memory store for quiz answer keys (keyed by `roadmapId_milestoneId`)
const quizAnswerStore = new Map<string, any[]>();

// POST — Generate quiz questions for a completed milestone
export async function POST(req: Request) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { roadmapId, milestoneId } = await req.json();

        if (!roadmapId || !milestoneId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: (session.user as any).id });
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        const milestone = (roadmap.milestones as any).id(milestoneId);
        if (!milestone) {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }

        // Check if milestone is completed
        if (milestone.status !== "completed") {
            return NextResponse.json({ message: "Milestone is not completed yet" }, { status: 400 });
        }

        // Check if quiz was already taken
        if (milestone.quizTakenAt) {
            return NextResponse.json({ message: "Quiz already taken for this milestone" }, { status: 400 });
        }

        const subtaskTitles = milestone.subtasks.map((st: any) => st.title);

        // Generate quiz with AI
        const quizQuestions = await generateQuizWithAI(
            milestone.title,
            milestone.description,
            subtaskTitles
        );

        // Store answer key server-side
        const storeKey = `${roadmapId}_${milestoneId}`;
        quizAnswerStore.set(storeKey, quizQuestions);

        // Send questions to client WITHOUT correct answers
        const clientQuestions = quizQuestions.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
        }));

        return NextResponse.json({ questions: clientQuestions }, { status: 200 });
    } catch (error: any) {

        const is429 = error?.status === 429 || error?.message?.includes("429");
        const is503 = error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("overloaded");

        if (is429) {
            return NextResponse.json(
                { message: "API quota exceeded. Your free-tier daily limit has been reached. Please wait a few minutes or try again later." },
                { status: 429 }
            );
        }
        if (is503) {
            return NextResponse.json(
                { message: "AI service is temporarily overloaded. Please wait a moment and try again." },
                { status: 503 }
            );
        }

        return NextResponse.json({ message: "Failed to generate quiz. Please try again." }, { status: 500 });
    }
}

// PUT — Submit answers and grade the quiz
export async function PUT(req: Request) {
    await dbConnected();
    const session = await auth();

    if (!session || !(session.user as any)?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { roadmapId, milestoneId, answers } = await req.json();

        if (!roadmapId || !milestoneId || !answers) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const storeKey = `${roadmapId}_${milestoneId}`;
        const quizQuestions = quizAnswerStore.get(storeKey);

        if (!quizQuestions) {
            return NextResponse.json({ message: "Quiz session expired or not found. Please regenerate the quiz." }, { status: 404 });
        }

        // Grade the quiz
        let score = 0;
        const total = quizQuestions.length;
        const results = quizQuestions.map((q: any) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) score++;
            return {
                id: q.id,
                question: q.question,
                options: q.options,
                userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation,
            };
        });

        // Save score to the milestone in the database
        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: (session.user as any).id });
        if (!roadmap) {
            return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
        }

        const milestone = (roadmap.milestones as any).id(milestoneId);
        if (!milestone) {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }

        milestone.quizScore = score;
        milestone.quizTotal = total;
        milestone.quizTakenAt = new Date();
        await roadmap.save();

        // Clean up the in-memory store
        quizAnswerStore.delete(storeKey);

        return NextResponse.json({ score, total, results }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Failed to grade quiz. Please try again." }, { status: 500 });
    }
}
