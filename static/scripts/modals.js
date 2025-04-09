const CONTAINER = document.querySelector("#modals-container");
const MODALS = [
    'login',
    'register',
]

function close(name) {
    document.querySelector(`#modal-${name}`).remove();
}

function open(name) {
    var modal = document.createElement('div');
    tab.className = "modal";
    fetch(`html/nav_tabs/${NAV_TABS[i]}.html`) 
        .then(response => response.text()) 
        .then(html => { 
            modal.innerHTML = html;
            CONTAINER.appendChild(tab);
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
}