const colorsArray = [
    '#6B0119', '#BD0037', '#FF4500', '#FEA800', '#FFD435', '#FEF8B9', '#01A267', '#09CC76',
    '#7EEC57', '#02756D', '#009DAA', '#00CCBE', '#277FA4', '#3790EA', '#52E8F3', '#4839BF',
    '#695BFF', '#94B3FF', '#801D9F', '#B449BF', '#E4ABFD', '#DD117E', '#FE3781', '#FE99A9',
    '#6D462F', '#9B6926', '#FEB470', '#000000', '#525252', '#888D90', '#D5D6D8', '#FFFFFF',
];


const colorPalette = document.getElementById('color-palette');
const colorContainer = document.getElementById('color-container');

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

    colorContainer.appendChild(colorElement);
}

document.querySelector("#color-tab").addEventListener("click", function() {
    if (colorPalette.classList.contains("active")) {
        hidePalette();
    } else {
        showPalette();
    }
})