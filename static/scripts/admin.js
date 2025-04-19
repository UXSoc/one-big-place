import { socket } from "./socket.js";

const admin_resize_contEl = document.getElementById('admin-tool-resize');
admin_resize_contEl.querySelector('button').addEventListener('click', () => {
    const dataInputs = admin_resize_contEl.querySelectorAll('input');
    const adminKey = document.getElementById('admin-key').value;
    const data = {
        adminKey: adminKey,
        width: parseInt(dataInputs[0].value),
        height: parseInt(dataInputs[1].value),
    }
    console.log(data)
    socket.emit("resize_canvas", data)
})