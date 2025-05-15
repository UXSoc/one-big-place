const CONTAINER = document.querySelector("#modals-container");
const MODALS = {
    'login': 'auth/login',
    'register': 'auth/register',
}

export function closeModal(name) {
    const modal = document.getElementById(`modal-${name}`);
    if (!!modal) {
        modal.classList.add('hidden');
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
    modal.classList.add("modal", "scroller");
    modal.style.padding = '2rem';
    if (closable) {
        closeButton.innerText = "Ok";
        closeButton.style.margin = "1rem auto";
        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.remove()
            onclose();
        })
        modal.append(header, p, closeButton);
    } else {
        modal.append(header, p);
    }
    CONTAINER.appendChild(modal);
}

export function openModal(name) {
    var modal = document.createElement('div');
    modal.classList.add("modal", "scroller");
    const OPENED_MODAL = document.querySelector(`#modal-${name}`);
    if (OPENED_MODAL) {
        OPENED_MODAL.classList.remove('hidden');
        return;
    }
    fetch(`html/${MODALS[name]}.html`)
        .then(response => response.text()) 
        .then(html => { 
            modal.innerHTML = html;
            modal.id = `modal-${name}`;
            var closeButton = document.createElement('p');
            closeButton.className = 'close-modal-button';
            closeButton.innerText = '✖';
            closeButton.addEventListener('click', (e) => {
                e.target.parentElement.classList.add('hidden');
            })
            modal.append(closeButton);
            CONTAINER.appendChild(modal);
            const links = modal.querySelectorAll('a');
            for (var link of links) {
                if (link.dataset.openmodal) {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        closeOthers();
                        openModal(link.dataset.openmodal);
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
            setTimeout(() => {
                CONTAINER.style.display = 'none';
                void CONTAINER.offsetHeight; // reflow
                CONTAINER.style.display = '';
            }, 0);
        }) 
        .catch(error => console.error('Error loading HTML:', error)); 
}
function updateContainerVisibility() {
    const modalExists = CONTAINER.querySelector('.modal');
    const loaderExists = CONTAINER.querySelector('#loader:not(.hidden)');
    if (!modalExists && !loaderExists) {
        CONTAINER.style.display = 'none';
    } else {
        CONTAINER.style.removeProperty('display');
    }
}
const observer = new MutationObserver(updateContainerVisibility);
observer.observe(CONTAINER, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
});
const loader = document.querySelector('#loader');
export function showLoading() { loader.classList.remove('hidden') }
export function hideLoading() { loader.classList.add('hidden') }
const loadingProgress = new Map([
    ['canvasLoad', false],
    ['socketConnect', false],
]);
export function setLoadingProgress(stage, status) {
    if (loadingProgress.has(stage)) {
        loadingProgress.set(stage, status);
    }
    const allDone = [...loadingProgress.values()].every(v => v === true);
    if (allDone) {
        hideLoading();
    } else {
        showLoading();
    }
}
