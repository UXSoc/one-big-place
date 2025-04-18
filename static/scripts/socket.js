import { paintPixelOnCanvas, syncCooldown } from "./paint.js";
import { openModal } from "./modals.js"
import { getUserData, updateUserData } from "./user.js";

export var socket;
export function connectToServer(ip) {
    socket = io(ip)
    setupEvents();
}

export function getLeaderboardData() {
    return leaderboard;
}

var leaderboard;
export function setLeaderboardData(leaderboardData) {
    leaderboard = leaderboardData;
}

function setupEvents() {
    socket.on("sync_cooldown", (data) => {
        syncCooldown(data);
    })
    socket.on("PaintPixel", async (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y, data.userId);
        if (data.userId) {
            const userData = await getUserData(data.userId);
            if (userData) updateUserData("placeCount", userData.placeCount+1, userData.id);
        }
    })
    socket.on("request_login", (data) => {
        openModal('login');
    })
}