import { paintPixelOnCanvas } from "./paint.js";
import { openModal } from "./modals.js"

export var socket;
export function connectToServer(ip) {
    socket = io(ip)
    setupEvents();
}

function setupEvents() {
    socket.on("PaintPixel", (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y);
    })
    socket.on("request_login", (data) => {
        openModal('login');
    })
}