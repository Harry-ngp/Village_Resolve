const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const chatWithAI = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Server API Key not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to try in order of preference (Based on user's available models)
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-2.5-flash",
        "gemini-1.5-flash"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are a helpful assistant for a platform called "Village Resolve". 
            Your goal is to help citizens fix local issues.
            Answer in the user's language.
            
            User: ${message}
            Assistant:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return res.json({ reply: text }); // Success! Return immediately.

        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to next model...
        }
    }

    // If we get here, all models failed
    console.error("All AI models failed.");
    res.status(500).json({
        error: "AI Service Unavailable (All models failed)",
        details: lastError ? lastError.message : "Unknown error"
    });
};

module.exports = { chatWithAI };
