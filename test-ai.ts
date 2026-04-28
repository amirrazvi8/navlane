import { config } from 'dotenv';
config();

import { generateRoadmapWithAI } from './src/lib/ai/gemini';

async function runTest() {
    console.log("⏳ Starting Roadmap Generation Test...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ No GEMINI_API_KEY found! Please make sure your .env file is saved.");
        return;
    }

    try {
        const start = Date.now();
        const result = await generateRoadmapWithAI("Full Stack Web Developer", [
            { name: "React", level: "Beginner" },
            { name: "Node.js", level: "Beginner" }
        ]);
        const duration = ((Date.now() - start) / 1000).toFixed(2);

        console.log(`✅ SUCCESS IN ${duration}s! Generated Roadmap payload:\n`);
        console.dir(result, { depth: null });
    } catch (error) {
        console.error("❌ Test failed:");
        console.error(error);
    }
}

runTest();
