const baseColors = ["#00cdc0", "#493ac1", "#3590ea", "#e6abfe", "#6b5cfe"];
const pieContainer = document.querySelector('.pie-container');
const pieElement = document.querySelector('.pie-container > .pie');
const pieRadius = pieElement.offsetWidth / 2;
function adjustColor(hex, factor) {
  const rgb = hex.match(/\w\w/g).map(c => parseInt(c, 16));
  const adjusted = rgb.map(c => Math.min(255, Math.max(0, Math.round(c * factor))));
  return `rgb(${adjusted.join(',')})`;
}

async function updatePieChart() {
  const response = await fetch('json/statistics/yr_dist');
  const data = await response.json();
  pieContainer.querySelectorAll('.label').forEach(el => el.remove());

  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, entry]) => sum + entry.pixelCount, 0);

  let currentAngle = 0;
  let gradientParts = [];

  entries.forEach(([label, value], i) => {
    console.log(value.pixelCount, total)
    const percentage = (value.pixelCount / total) * 100;
    const angle = (percentage / 100) * 360;
    const midAngle = currentAngle + angle / 2;

    const colorIndex = i % baseColors.length;
    const variation = 1 + Math.floor(i / baseColors.length) * 0.1 * (i % 2 === 0 ? 1 : -1);
    const color = adjustColor(baseColors[colorIndex], variation);

    const start = currentAngle;
    const end = currentAngle + angle;
    gradientParts.push(`${color} ${start}deg ${end}deg`);

    // Label setup
    const labelEl = document.createElement("div");
    labelEl.className = "label";
    labelEl.style.transform = `
      rotate(${midAngle}deg)
      translateY(-${pieRadius+25}px)
      rotate(${-midAngle}deg)
    `;
    labelEl.innerHTML = `${label}'<br><span>${percentage.toFixed(1)}%</span>`;
    pieElement.appendChild(labelEl);

    currentAngle += angle;
  });
  pieElement.style.backgroundImage = `conic-gradient(${gradientParts.join(', ')})`;
}
updatePieChart();