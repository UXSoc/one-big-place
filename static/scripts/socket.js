import { paintPixelOnCanvas, syncCooldown } from "./paint.js";
import { setLoadingProgress, openModal } from "./modals.js"
import { getUserGrid, loadCanvas, setUserGrid } from "./canvas.js";
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
    socket.on("connect", (data) => {
        setLoadingProgress('socketConnect', true);
    })
    socket.on("disconnect", (data) => {
        setLoadingProgress('socketConnect', false);
    })
    socket.on("sync_cooldown", (data) => {
        syncCooldown(data);
    })
    socket.on("PaintPixel", async (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y, data.userId);
        if (data.userId) {
            await updateChallengeProgress(data);
            setUserGrid(data.userId, data.x, data.y);
        }
    })
    socket.on("request_login", (data) => {
        openModal('register');
    })
    socket.on("reload_canvas", () => {
        loadCanvas(document.getElementById('canvas').querySelector('.image'), false);
    })
}

function isLunch() {
    return timeBetw('11:00:00', '14:00:00');
}

function getCurrentDate() {
    const manilaStr = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    return new Date(manilaStr);
}

function timeBetw(startTime, endTime) {
    const currentDate = getCurrentDate();
    const [startH, startM, startS] = startTime.split(":").map(Number);
    const [endH, endM, endS] = endTime.split(":").map(Number);
    const startDate = new Date(currentDate.getTime());
    startDate.setHours(startH, startM, startS, 0);
    const endDate = new Date(currentDate.getTime());
    endDate.setHours(endH, endM, endS, 0);
    if (endDate <= startDate) {
        if (currentDate >= startDate) {
            return true;
        } else {
            endDate.setDate(endDate.getDate() + 1);
            return currentDate < endDate;
        }
    }
    return currentDate >= startDate && currentDate < endDate;
}

export async function updateChallengeProgress(data) {
    if (!data.userId) return;
    const userData = await getUserData(data.userId);
    if (userData) updateUserData("placeCount", userData.placeCount+1, userData.id);
    if (isLunch()) updateUserData("placedBreak", userData.placedBreak+1, userData.id);
    const currentUser = getUserGrid()[data.y][data.x];
    if (currentUser !== data.userId) updateUserData("replaced", userData.replaced+1, userData.id);
}
