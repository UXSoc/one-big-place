const NAV_ITEMS = document.querySelectorAll("nav > ul > li")
const NAV = document.querySelector("nav")
const NAV_TABS = [
    "leaderboard",
    "challenges",
    "coverage",
    "gifts",
    "credits",
]

function closeTabs() {
    document.querySelectorAll(".nav-tab").forEach((item) => {
        item.remove();
    })
    NAV.classList.remove("active")
    NAV_ITEMS.forEach((item) => {
        item.classList.remove("active");
    })
}
export function setupTabs() {
    document.addEventListener("click", (e) => {
        if (!NAV.contains(e.target)) {
            closeTabs();
        }
    })
    for (let i = 0; i < NAV_ITEMS.length; i++) {
        NAV_ITEMS[i].addEventListener('click', function() {
            closeTabs();
            NAV.classList.add("active")
            NAV_ITEMS[i].classList.add("active")
            fetch(`html/nav_tabs/${NAV_TABS[i]}.html`) 
            .then(response => response.text()) 
            .then(html => { 
                var tab = document.createElement("div")
                tab.className = "nav-tab"
                if (window.matchMedia('only screen and (min-width: 1200px)').matches) {
                    tab.style.maxHeight = `${NAV.offsetHeight}px`;
                }
                tab.innerHTML = html
                NAV.appendChild(tab);
            }) 
            .catch(error => console.error('Error loading HTML:', error)); 
        });
    }
}
