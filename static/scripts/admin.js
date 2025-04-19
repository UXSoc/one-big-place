import { closeTabs } from "./nav.js";
import { selectArea } from "./selector.js";
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
    socket.emit("resize_canvas", data)
})

const admin_fill_contEl = document.getElementById('admin-tool-fill');
admin_fill_contEl.querySelectorAll('button')[0].addEventListener('click', () => {
    closeTabs();
    selectArea((pos1, pos2) => {
        const posInputs = admin_fill_contEl.querySelectorAll('input[type=number]');
        const [x1, y1] = pos1;
        const [x2, y2] = pos2;
        posInputs[0].value = x1;
        posInputs[1].value = y1;
        posInputs[2].value = x2;
        posInputs[3].value = y2;
    })
})

admin_fill_contEl.querySelectorAll('button')[1].addEventListener('click', () => {
    const dataInputs = admin_fill_contEl.querySelectorAll('input');
    const adminKey = document.getElementById('admin-key').value;
    const data = {
        adminKey: adminKey,
        x1: parseInt(dataInputs[0].value),
        y1: parseInt(dataInputs[1].value),
        x2: parseInt(dataInputs[2].value),
        y2: parseInt(dataInputs[3].value),
        color: parseInt(dataInputs[4].value),
        randomFill: dataInputs[5].checked,
    }
    socket.emit("fill_area", data)
    const highlighter = document.querySelector('.panner_interface > .selection-highlight');
    highlighter.style.display = 'none';
})

const admin_reload_contEl = document.getElementById('admin-tool-reload');
admin_reload_contEl.querySelectorAll('button')[0].addEventListener('click', () => {
    const adminKey = document.getElementById('admin-key').value;
    const data = {
        adminKey: adminKey
    }
    socket.emit("reload_clients", data);
})

const admin_broadcast_contEl = document.getElementById('admin-tool-broadcast');
admin_broadcast_contEl.querySelectorAll('button')[0].addEventListener('click', () => {
    const adminKey = document.getElementById('admin-key').value;
    const dataInputs = admin_broadcast_contEl.querySelectorAll('input');
    const data = {
        adminKey: adminKey,
        heading: dataInputs[0].value,
        message: dataInputs[1].value,
        closable: dataInputs[2].checked,
    }
    socket.emit("broadcast_message", data);
})