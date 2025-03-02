const colorsArray = [
    '#6D001A', '#BE0039', '#FF4500', '#FF7B00', '#FFA800', '#FFD635',
    '#FFF34E', '#CAFF4E', '#7EED56', '#0EB60C', '#00A368', '#00CC78',
    '#00756F', '#009EAA', '#00CCC0', '#51E9F4', '#3690EA', '#2450A4',
    '#493AC1', '#6A5CFF', '#94B3FF', '#E4ABFF', '#B44AC0', '#811E9F',
    '#DE107F', '#FF3881', '#FF99AA', '#5A2D12', '#6D482F', '#9C6926',
    '#FFB470', '#FFF8B8', '#000000', '#515252', '#898D90', '#D4D7D9', '#FFFFFF'
];

const colorPalette = document.getElementById('color-palette');

export function showPalette() {
    colorPalette.classList.add("active");
}

export function hidePalette() {
    colorPalette.classList.remove("active");
}

for (let i = 0; i < colorsArray.length; i++) {
    const colorElement = document.createElement("div");
    colorElement.className = "colors";
    colorElement.style.backgroundColor = colorsArray[i];
    colorElement.id = i;

    colorElement.onclick = function () {
        const selectedColor = this.style.backgroundColor;

        const colorChangeEvent = new CustomEvent("colorSelected", {
            detail: { color: selectedColor }
        });
        document.dispatchEvent(colorChangeEvent);
    };

    colorPalette.appendChild(colorElement);
}