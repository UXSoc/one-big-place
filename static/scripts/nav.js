const NAV_ITEMS = document.querySelectorAll("nav > ul > li")
const NAV = document.querySelector("nav")
const MODALS = [
    "leaderboard",
    "challenges",
    "coverage",
    "gifts",
    "credits",
]

function closeModals() {
    document.querySelectorAll(".modal").forEach((item) => {
        item.remove();
    })
    NAV.classList.remove("active")
    NAV_ITEMS.forEach((item) => {
        item.classList.remove("active");
    })
}

document.addEventListener("click", (e) => {
    if (!NAV.contains(e.target)) {
        closeModals();
    }
})

for (let i = 0; i < NAV_ITEMS.length; i++) {
    NAV_ITEMS[i].addEventListener('click', function() {
        closeModals();
        NAV.classList.add("active")
        NAV_ITEMS[i].classList.add("active")
        fetch(`modals/${MODALS[i]}.html`) 
        .then(response => response.text()) 
        .then(html => { 
            var modal = document.createElement("div")
            modal.className = "modal"
            if (window.matchMedia('only screen and (min-width: 1200px)').matches) {
                modal.style.maxHeight = `${NAV.offsetHeight}px`;
            }
            modal.innerHTML = html
            NAV.appendChild(modal);
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
    });
}