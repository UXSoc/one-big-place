import { hidePalette } from "./palette.js";
import { getUserData } from "./user.js";

const NAV = document.querySelector("nav")
const NAV_TABS = [
    "leaderboard",
    "challenges",
    "coverage",
    "gifts",
    "credits",
    "admin"
]

export function closeTabs() {
    const NAV_ITEMS = document.querySelectorAll("nav > ul > li")
    document.querySelectorAll(".nav-tab").forEach((item) => {
        item.style.display = 'none';
    })
    NAV.classList.remove("active")
    NAV_ITEMS.forEach((item) => {
        item.classList.remove("active");
    })
}
export async function badge(id, active) {
    const navTab = document.getElementById(`nav-button-${id}`);
    if (active) navTab.classList.add("badge");
    else navTab.classList.remove("badge");
}
export async function setupTabs() {
    document.addEventListener("click", (e) => {
        if (!NAV.contains(e.target)) {
            closeTabs();
        }
    })
    const userData = await getUserData();
    if (userData?.username == "admin") {
        const navButton = document.createElement('li');
        const navIcon = document.createElement('img');
        const navP = document.createElement('p');
        navButton.className = "nav-button";
        navIcon.src = "images/Info.svg";
        navP.innerText = "Admin Tools";
        navButton.append(navIcon, navP);
        NAV.querySelector('ul').append(navButton);
    }
    const NAV_ITEMS = document.querySelectorAll("nav > ul > li")
    for (let i = 0; i < NAV_ITEMS.length; i++) {
        NAV_ITEMS[i].addEventListener('click', async function() {
            if (NAV_ITEMS[i].classList.contains("active")) {
                closeTabs();
                return;
            };
            closeTabs();
            hidePalette();
            NAV.classList.add("active")
            NAV_ITEMS[i].classList.add("active")
            const tab = await loadTab(NAV_TABS[i], true);
            if (NAV_TABS[i] == 'challenges') {
                const challengeContainer = tab.querySelector('.challenges.scroller');
                const challengeToClaim = challengeContainer.querySelector('.indicator.to-claim');

                const containerRect = challengeContainer.getBoundingClientRect();
                const targetRect = challengeToClaim.getBoundingClientRect();

                const offset = targetRect.top - containerRect.top;
                const scroll = offset - challengeContainer.clientHeight / 2 + challengeToClaim.clientHeight / 2;
                challengeContainer.scrollBy({ top: scroll, behavior: 'smooth' });
            }
        });
    }
}
export async function loadTab(tab_name, show) {
    const NAV_TAB = document.querySelector(`#nav-tab-${tab_name}`);
    if (NAV_TAB) {
        if (show) NAV_TAB.style.display = 'block';
        return NAV_TAB;
    }
    var tab = document.createElement("div");
    tab.style.display = show?'block':'none';
    tab.className = "nav-tab";
    tab.id = `nav-tab-${tab_name}`;
    if (window.matchMedia('only screen and (min-width: 1200px)').matches) tab.style.maxHeight = `${NAV.offsetHeight}px`;

    if (show) {
        var loader = document.createElement('div');
        loader.className = 'loader-bar';
        loader.style.width = '230px';
        loader.style.margin = 'auto';
        for (let i=0;i<10;i++) {
            loader.append(document.createElement('div'))
        }
        for (let i=0;i<10;i++) {
            let corner = document.createElement('div');
            corner.className = 'cut-corners';
            loader.append(corner);
        }
        tab.append(loader);
    }

    NAV.appendChild(tab);
    try {
        const response = await fetch(`html/nav_tabs/${tab_name}.html?ts=${Date.now()}`);
        const html = await response.text();
        tab.innerHTML = html
        const scripts = tab.querySelectorAll("script");
        scripts.forEach((oldScript) => {
            const newScript = document.createElement("script");
            [...oldScript.attributes].forEach((attr) =>
                newScript.setAttribute(attr.name, attr.value)
            );
            newScript.text = oldScript.text;
            oldScript.replaceWith(newScript);
        });
    } catch (error) {
        console.error('Error loading HTML:', error)
    }
    return tab;
}
loadTab('challenges', false);