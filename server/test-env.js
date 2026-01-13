require('dotenv').config();
console.log("Checking environment variables...");
console.log("GEMINI_API_KEY present:", process.env.GEMINI_API_KEY ? "YES" : "NO");
if (process.env.GEMINI_API_KEY) {
    console.log("Key length:", process.env.GEMINI_API_KEY.length);
    console.log("First 4 chars:", process.env.GEMINI_API_KEY.substring(0, 4));
} else {
    console.log("Please ensure 'GEMINI_API_KEY' is exactly defined in .env");
}
