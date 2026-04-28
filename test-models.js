const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function run() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  let apiKey = '';
  envFile.split('\n').forEach(line => {
    if (line.startsWith('GEMINI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  });

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await response.json();
    console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
