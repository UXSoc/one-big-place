const CONTAINER = document.querySelector("#modals-container");
const MODALS = {
    'login': 'auth/login',
    'register': 'auth/register',
}

export function closeModal(name) {
    const modal = document.getElementById(`modal-${name}`);
    if (!!modal) {
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
    var header = document.createElement('h3');
    var p = document.createElement('p');
    var closeButton = document.createElement('button');
    header.innerText = heading;
    p.innerText = message;
    closeButton.innerText = "Ok";
    closeButton.addEventListener('click', (e) => {
        e.target.parentElement.remove()
        onclose();
    })
    modal.className = "modal";
    modal.append(header, p, closeButton);
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
                if (link.dataset.openmodal) {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        closeOthers();
                        openModal(link.dataset.openmodal)
                    })
                }
            }
            const scripts = modal.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                [...oldScript.attributes].forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
                );
                newScript.text = oldScript.text;
                oldScript.replaceWith(newScript);
            });
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
}