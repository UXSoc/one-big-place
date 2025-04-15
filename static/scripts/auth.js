import { openCustomModal, openModal } from "./modals.js";

export function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const openmodal = urlParams.get('open-modal');
    const error = urlParams.get('error');
    const success = urlParams.get('success');

    if (error) {
        const msg = decodeURIComponent(error);
        const modal = decodeURIComponent(openmodal);
        onclose = openmodal?() => {openModal(modal)}:() => {}; 
        openCustomModal("An error has occurred.", msg, true, onclose)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (success) {
        const msg = decodeURIComponent(success);
        const modal = decodeURIComponent(openmodal);
        onclose = openmodal?() => {openModal(modal)}:() => {}; 
        openCustomModal(msg, "", true, onclose)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
