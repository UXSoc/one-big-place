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
        NAV_ITEMS[i].addEventListener('click', function() {
            if (NAV_ITEMS[i].classList.contains("active")) {
                closeTabs();
                return;
            };
            closeTabs();
            hidePalette();
            NAV.classList.add("active")
            NAV_ITEMS[i].classList.add("active")
            const NAV_TAB = document.querySelector(`#nav-tab-${NAV_TABS[i]}`);
            if (NAV_TAB) {
                NAV_TAB.style.display = 'block';
                return;
            }
            var tab = document.createElement("div");
            tab.className = "nav-tab";
            tab.id = `nav-tab-${NAV_TABS[i]}`;
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
            NAV.appendChild(tab);
            fetch(`html/nav_tabs/${NAV_TABS[i]}.html`) 
            .then(response => response.text()) 
            .then(html => { 
                if (window.matchMedia('only screen and (min-width: 1200px)').matches) {
                    tab.style.maxHeight = `${NAV.offsetHeight}px`;
                }
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

            }) 
            .catch(error => console.error('Error loading HTML:', error)); 
        });
    }
}
