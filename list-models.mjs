import fs from 'fs';

async function fetchModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No API KEY found");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.models) {
        let output = "AVAILABLE MODELS:\n";
        data.models.forEach(m => {
            output += `${m.name} - Supported: ${m.supportedGenerationMethods.join(", ")}\n`;
        });
        fs.writeFileSync('models.txt', output);
    } else {
        fs.writeFileSync('models.txt', "DATA ERROR: " + JSON.stringify(data));
    }
}

fetchModels().catch(err => fs.writeFileSync('models.txt', 'ERROR: ' + err.toString()));
