var modals = [
    "leaderboard",
    "challenges",
    "coverage",
    "gifts",
    "credits",
]

const nav_items = document.querySelectorAll("nav > ul > li")
const nav = document.querySelector("nav")
for (let i = 0; i < nav_items.length; i++) {
    nav_items[i].addEventListener('click', function() {
        console.log("click")
        document.querySelectorAll(".modal").forEach((item) => {
            item.remove();
        })
        fetch(`modals/${modals[i]}.html`) 
        .then(response => response.text()) 
        .then(html => { 
            var modal = document.createElement("div")
            modal.className = "modal"
            modal.style.maxHeight = `${nav.offsetHeight}px`;
            modal.innerHTML = html
            nav.appendChild(modal); 
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
    });
}