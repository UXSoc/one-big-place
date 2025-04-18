const fs = require('fs');
const path = require("path");

let challenges;
function loadChallenges() {
    if (challenges) return challenges; 
    const filePath = path.join(__dirname, "..", "server_json", "challenges.json");
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        challenges = JSON.parse(data);
        return challenges;
    } catch (err) {
        console.error('Error loading/parsing challenges:', err);
    }
}

function isChallenge(code) {
    const challenges = loadChallenges()
    if (!code.startsWith("challenge-")) return false;
    code = code.slice(10);
    return challenges.some(ch => ch.id === code);;
}

module.exports = {
    isChallenge: isChallenge,
}