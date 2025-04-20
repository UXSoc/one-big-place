const tutorialData = [
    {
        el: null,
        allowClick: false,
        pos: "center",
        heading: "Take a tour!",
        content: "Take a quick tour to learn the basics. We'll show you how to use the key features and get you started on adding to the project.",
    },
    {
        container: document.body,
        el: document.querySelector('#canvas'),
        allowClick: false,
        pos: ["50vw", "50vh", "auto", "auto"],
        heading: "Canvas",
        content: "This is the canvas. Click anywhere on the canvas to select a pixel.",
    },
    {
        el: document.querySelector('.canvas-coordinates'),
        allowClick: false,
        pos: ["50vw", "50vh", "auto", "auto"],
        heading: "Coordinates",
        content: "Every pixel has a unique (X, Y) position on the canvas. Use coordinates to navigate or plan precise placements.",
    },
    {
        el: document.querySelector('#color-palette'),
        allowClick: false,
        pos: ["50vw", "50vh", "auto", "auto"],
        heading: "Color Palette",
        content: "This is your palette window. \nClick on the color you want to use and the selected pixel will change to your chosen color!",
    },
    {
        el: document.querySelector('#bits-display'),
        allowClick: false,
        pos: ["50vw", "50vh", "auto", "auto"],
        heading: "Bits",
        content: "These are your bits. Placing a pixel costs 1 bit, and bits regenerate over time—so spend them wisely!",
    },
    {
        el: document.querySelector('nav'),
        allowClick: false,
        pos: ["50vw", "50vh", "auto", "auto"],
        heading: "Navigation Bar",
        content: "Hover over this area to reveal the tab labels. Here, you’ll find the leaderboard, challenges, and canvas coverage. You can also redeem gift codes here and see the creators of this website!",
    },
    {
        el: null,
        allowClick: false,
        pos: "center",
        heading: "Have fun!",
        content: "Good job! That concludes the tour. Collaboration is key, so have fun working with others!",
    },
]

let elementHighlighted;
let currentTutorialStep = 0;
function highlight(el, allowClick) {
    stopHighlights();
    const backdrop = document.createElement('div');
    backdrop.className = 'tutorial-backdrop';
    document.body.append(backdrop);
    elementHighlighted = el;
    if (!el) return;
    el.style.zIndex = '50';
    el.style.filter = 'drop-shadow(0px 0px 40px white)';
    if (!allowClick) el.style.pointerEvents = 'none';
}

function stopHighlights() {
    if (elementHighlighted) {
        elementHighlighted.style.zIndex = '';
        elementHighlighted.style.filter = '';
        elementHighlighted.style.pointerEvents = '';
    } 
    const oldBackdrops = document.querySelectorAll('.tutorial-backdrop');
    if (oldBackdrops) oldBackdrops.forEach((item) => {
        item.remove()
    })
}

function tutorialNext(step) {
    const oldTutorialWindows = document.querySelectorAll('.tutorial-window');
    if (oldTutorialWindows) oldTutorialWindows.forEach((item) => {
        item.remove()
    })
    currentTutorialStep = currentTutorialStep+step;
    const stepData = tutorialData[currentTutorialStep];
    highlight(stepData.el, stepData.allowClick);
    showTutorialWindow(stepData.container, stepData.heading, stepData.content, stepData.pos, currentTutorialStep>0, currentTutorialStep<tutorialData.length-1)
}

function showTutorialWindow(container, heading, content, pos, prev, next) {
    const tutorialWindow = document.createElement('div');
    const headingEl = document.createElement('h3');
    const contentEl = document.createElement('p');
    const buttonsContainer = document.createElement('div');
    tutorialWindow.className = "tutorial-window";
    if (pos !== "center") {
        tutorialWindow.style.top = pos[0];
        tutorialWindow.style.right = pos[1];
        tutorialWindow.style.bottom = pos[2];
        tutorialWindow.style.left = pos[3];
    }
    headingEl.innerText = heading;
    contentEl.innerText = content;
    if (prev) {
        const button = document.createElement('button');
        button.innerText = "Previous"
        button.addEventListener('click', () => {
            tutorialNext(-1);
        })
        buttonsContainer.append(button);
    }
    const button = document.createElement('button');
    if (next) {
        button.innerText = "Next"
        button.addEventListener('click', () => {
            tutorialNext(1);
        })
    } else {
        button.innerText = "Start Playing!"
        button.addEventListener('click', () => {
            stopHighlights();
        })
    }
    buttonsContainer.append(button);
    tutorialWindow.append(headingEl, contentEl, buttonsContainer);
    if (!container) {
        document.querySelector('.tutorial-backdrop').append(tutorialWindow);
    } else {
        container.append(tutorialWindow);
    };
}

export function startTutorial() {
    tutorialNext(0);
}