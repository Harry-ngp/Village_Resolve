const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API Key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct "listModels" on the main class in some versions, 
        // but let's try the standard pattern or just query the API directly if SDK fails.
        // Actually, creating a model and catching error is what we are debugging, 
        // but the error message suggested calling ListModels.
        // The SDK exposes it via the ModelManager usually, but let's try a direct fetch to be safe and dependency-free.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("--- AVAILABLE RESPONDING MODELS ---");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`Name: ${m.name.replace('models/', '')}`);
                }
            });
        } else {
            console.log("Could not list models. Response:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
