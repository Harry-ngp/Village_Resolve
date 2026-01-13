const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const fs = require('fs');

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API Key");
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        // Write full raw JSON to file to avoid console truncation/interleaving issues
        fs.writeFileSync('raw_models_response.json', JSON.stringify(data, null, 2));
        console.log("Models saved to raw_models_response.json");

    } catch (error) {
        console.error("Error:", error);
    }
}

checkModels();
