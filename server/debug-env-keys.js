require('dotenv').config();
const fs = require('fs');

console.log("--- LOADED ENVIRONMENT VARIABLES ---");
const keys = Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('Program'));
keys.forEach(k => {
    if (k.includes('GEMINI') || k.includes('KEY') || k.includes('API')) {
        console.log(`Key: '${k}' (Length: ${k.length})`);
    }
});

console.log("\n--- RAW .ENV FILE CONTENT CHECK ---");
try {
    const content = fs.readFileSync('.env', 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('GEMINI')) {
            console.log(`Line ${idx + 1}: ${JSON.stringify(line)}`);
        }
    });
} catch (e) {
    console.log("Could not read .env file directly.");
}
