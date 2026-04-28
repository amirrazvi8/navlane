import { GoogleGenerativeAI } from '@google/generative-ai';

async function runTest() {
  console.log("⏳ Starting Roadmap Generation Test...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ No GEMINI_API_KEY found! Please make sure your .env file is saved and you use the --env-file flag.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are an expert technical mentor. 
  The user wants to achieve this career goal: "Full Stack Web Developer".
  Here are their current skills: [{"name":"React", "level": "Beginner"}].
  
  Please provide a structured learning roadmap. Return strictly a JSON object matching this schema without any markdown wrapping or extra text:
  {
    "title": "...",
    "description": "...",
    "milestones": [
      {
        "title": "...",
        "description": "...",
        "topics": ["...", "..."],
        "resources": [
          { "name": "...", "url": "..." }
        ]
      }
    ]
  }
  `;

  try {
    const start = Date.now();
    const result = await model.generateContent(prompt);
    let str = result.response.text();
    const jsonStr = str.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ SUCCESS IN ${duration}s! Generated Roadmap payload:\n`);
    console.dir(data, { depth: null });
  } catch (error) {
    console.error("❌ Test failed:");
    console.error(error);
  }
}

runTest();
