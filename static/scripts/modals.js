const CONTAINER = document.querySelector("#modals-container");
const MODALS = {
    'login': 'auth/login',
    'register': 'auth/register',
}

export function closeModal(name) {
    const modal = document.getElementById(`modal-${name}`);
    console.log(`${name} ${!!modal}`)
    if (!!modal) {
        console.log(`closing ${name}`)
        modal.remove()
    };
}

export function closeOthers() {
    for (const [key, value] of Object.entries(MODALS)) {
        closeModal(key);
    }
}

export function openCustomModal(heading, message, closable=true, onclose=()=>{}) {
    var modal = document.createElement('div');
    var h1 = document.createElement('p');
    var p = document.createElement('p');
    var closeButton = document.createElement('button');
    h1.innerText = heading;
    p.innerText = message;
    closeButton.innerText = "Ok";
    closeButton.addEventListener('click', (e) => {
        e.target.parentElement.remove()
        onclose();
    })
    modal.className = "modal";
    modal.append(h1, p, closeButton);
    CONTAINER.appendChild(modal);
}

export function openModal(name) {
    var modal = document.createElement('div');
    modal.className = "modal";
    fetch(`html/${MODALS[name]}.html`) 
        .then(response => response.text()) 
        .then(html => { 
            modal.innerHTML = html;
            modal.id = `modal-${name}`;
            CONTAINER.appendChild(modal);
            const links = modal.querySelectorAll('a');
            for (var link of links) {
                console.log(link.dataset.openmodal)
                if (link.dataset.openmodal) {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        closeOthers();
                        openModal(link.dataset.openmodal)
                    })
                }
            }
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
}