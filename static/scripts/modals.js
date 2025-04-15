const CONTAINER = document.querySelector("#modals-container");
const MODALS = {
    'login': 'auth/login',
    'register': 'auth/register',
}

export function closeModal(name) {
    document.querySelector(`#modal-${name}`).remove();
}

export function openModal(name) {
    var modal = document.createElement('div');
    modal.className = "modal";
    fetch(`html/${MODALS[name]}.html`) 
        .then(response => response.text()) 
        .then(html => { 
            modal.innerHTML = html;
            CONTAINER.appendChild(modal);
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
}