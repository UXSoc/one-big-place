import { paintPixelOnCanvas, syncCooldown } from "./paint.js";
import { setLoadingProgress, openModal } from "./modals.js"

export var socket;
export function connectToServer(ip) {
    socket = io(ip)
    setupEvents();
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
    socket.on("PaintPixel", (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y, data.userId);
    })
    socket.on("request_login", () => {
        openModal('login');
    })
}