import { paintPixelOnCanvas, syncCooldown } from "./paint.js";
import { openModal } from "./modals.js"

let leaderboard = null;

async function fetchData() {
    try {
        leaderboard = await fetch("json/statistics/leaderboard").then((res) => res.json());
    } catch (err) {
        console.error(err);
    }
}

fetchData();

export var socket;
export function connectToServer(ip) {
    socket = io(ip)
    setupEvents();
}

export function getLeaderboardData() {
    return leaderboard;
}

export function setLeaderboardData(leaderboardData) {
    leaderboard = leaderboardData;
}

function setupEvents() {
    socket.on("sync_cooldown", (data) => {
        syncCooldown(data);
    })
    socket.on("PaintPixel", (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y, data.userId);
        leaderboard["user"]["placeCount"]++;
        for (const user of leaderboard["leaderboard"]) {
            if (user["id"] === data.userId) {
                user["placeCount"]++;
                break;
            }
        }
    })
    socket.on("request_login", (data) => {
        openModal('login');
    })
}