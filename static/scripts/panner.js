var last_click = {
    x: 0,
    y: 0,
    date: null
}
var iPosX, iPosY
function dragElement(el, onDragStart, onDrag, onDragEnd, zoom_options) {
    el.onmousedown = (e) => dragStart(e, el, false, onDragStart, onDrag, onDragEnd);
    el.ontouchstart = (e) => dragStart(e, el, true, onDragStart, onDrag, onDragEnd);
    el.panner_container.addEventListener('DOMMouseScroll', (e) => handleScroll(e, el, zoom_options), false);
    el.panner_container.addEventListener('mousewheel',(e) => handleScroll(e, el, zoom_options), false);
}
function dragStart(e, el, touch, callback, onDrag, onDragEnd) {
    e = e || el.panner_container.event;
    e.preventDefault();
    var cursor = (touch)?e.touches[0]:e
    iPosX = cursor.clientX;
    iPosY = cursor.clientY;
    el.onmouseleave = () => {onDragEnd(); last_click.date=null; dragEnd(cursor, el)};
    el.onmouseup = () => {onDragEnd(); dragEnd(cursor, el)};
    el.ontouchend = () => {onDragEnd(); dragEnd(cursor, el)};
    el.onmousemove = (e) => elementDrag(e, el, touch, onDrag);
    el.ontouchmove = (e) => elementDrag(e, el, touch, onDrag);
    if (callback) callback(); // OpenNav(false)
    last_click.date = new Date();
    el.moved = false;
}
function dragEnd(cursor, el) {
    var rect = el.getBoundingClientRect();
    var x = (el.panner_container.offsetWidth/2)-rect.left;
    var y = (el.panner_container.offsetHeight/2)-rect.top;
    var pixelX = Math.floor(x*el.pixel_width/el.offsetWidth);
    var pixelY = Math.floor(y*el.pixel_height/el.offsetHeight);
    last_click.x = pixelX;
    last_click.y = pixelY;
    el.onmouseup = null;
    el.onmousemove = null;
    el.ontouchend = null;
    el.ontouchmove = null;
    if (last_click.date!==null) {
        const now = new Date();
        const speed = now-last_click.date;
        if (speed <= 200 && !el.moved) {
            el.onclickFunc(cursor);
        }
    }
}
function elementDrag(e, el, touch, callback) {
    if (callback) callback();
    e.preventDefault();
    var cursor = (touch)?e.touches[0]:e;
    // calculate the new cursor position:
    var pos1 = iPosX - cursor.clientX;
    var pos2 = iPosY - cursor.clientY;
    iPosX = cursor.clientX;
    iPosY = cursor.clientY;
    // set the element's new position:
    var cur_transl = el.style.translate.split(' ');
    if (cur_transl == '') el.style.translate = '0px 0px';
    var cur_x = parseFloat(cur_transl[0]) || 0;
    var cur_y = parseFloat(cur_transl[1]) || 0;
    el.moved = true;
    setPos(el, cur_x-pos1, cur_y-pos2);
}
var handleScroll = function(e, el, zoom_options) {
    e.preventDefault();
    var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail : 0;
    var dir = 1;
    if (delta <= 0) dir *= -1;
    zoom(el, Math.max(el.min_zoom, Math.min(el.max_zoom, el.zoom+zoom_options.step*dir)), last_click.x, last_click.y);
};
function setPos(el, x, y) {
    el.style.translate = `${x}px ${y}px`;
}
function center(el, x, y) {
    x = (x==undefined||x==null)?el.pixel_width/2:x
    y = (y==undefined||y==null)?el.pixel_height/2:y
    var offsetX, offsetY;
    if ((x!==undefined||x!==null) && (y!==undefined||y!==null)) {
        const pixel_size = el.offsetWidth/el.pixel_width;
        offsetX = (el.panner_container.offsetWidth/2)-(pixel_size*x);
        offsetY = (el.panner_container.offsetHeight/2)-(pixel_size*y);
    } else {
        offsetX = (el.panner_container.offsetWidth/2)-((el.scrollWidth)/2);
        offsetY = (el.panner_container.offsetHeight/2)-((el.scrollHeight)/2);
    }
    setPos(el, offsetX, offsetY);
    last_click.x = x;
    last_click.y = y;
}
function zoom(el, zoom_value, x, y) {
    if (el.zoom_lock) return;
    el.style.width = `${Math.floor(el.pixel_width*zoom_value)}px`;
    const interface_elements = el.interface.querySelectorAll('*');
    interface_elements.forEach(element => {
        if (element.interfacePos !== undefined || element.interfacePos !== null) {
            const pixel_size = el.offsetWidth/el.pixel_width;
            const rect = element.getBoundingClientRect();
            const x = element.interfacePos[0];
            const y = element.interfacePos[1];
            element.style.translate = `${x*pixel_size}px ${y*pixel_size}px`;
        }
    });
    el.zoom = zoom_value;
    center(el, x, y);
}
export function pannerInit(el, options) {
    if (!el.parentElement.classList.contains("panner-container")) {console.error("Failed to initialize panner: element not inside panner container")};
    el.panner_container = el.parentElement;
    el.img = el.querySelector(".image");
    el.interface = el.querySelector(".panner_interface");
    el.updateSize = () => {
        el.pixel_width = el.img.width;
        el.pixel_height = el.img.height;
        el.style.width = `${el.pixel_width * el.zoom}px`;
    }
    el.updateSize();
    el.center = (x, y) => {
        center(el);
    }
    if (el.style.position == '');
    el.min_zoom = options.zoom.min;
    el.max_zoom = options.zoom.max;
    el.zoom = options.zoom.value || 1;
    el.style.width = `${el.pixel_width * el.zoom}px`;
    el.zoom_lock = !options.zoom?.allow || false;
    dragElement(el, options.onDragStart, options.onDrag, options.onDragEnd, options.zoom);
    if (options.pos == "center") {
        center(el);
    }
    el.onclickFunc = (cursor) => {
        var rect = el.getBoundingClientRect();
        var x = cursor.clientX - rect.left;
        var y = cursor.clientY - rect.top;
        var pixelX = Math.floor(x*el.pixel_width/el.offsetWidth);
        var pixelY = Math.floor(y*el.pixel_height/el.offsetHeight);
        options.onClick(pixelX, pixelY, x, y);
    }
}