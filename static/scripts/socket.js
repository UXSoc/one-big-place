import { paintPixelOnCanvas } from "./paint.js";

export var socket;
export function connectToServer(ip) {
    socket = io.connect(ip);
    setupEvents();
}

function setupEvents() {
    socket.on("PaintPixel", (data) => {
        paintPixelOnCanvas(data.id, data.x, data.y);
    })
}