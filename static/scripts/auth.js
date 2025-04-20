import { openCustomModal, openModal } from "./modals.js";
import { startTutorial } from "./tutorial.js";

export function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const openmodal = urlParams.get('open-modal');
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    const firstLogin = urlParams.get('firstLogin');

    if (error) {
        const msg = decodeURIComponent(error);
        const modal = decodeURIComponent(openmodal);
        const onclose = openmodal?() => {openModal(modal)}:() => {}; 
        openCustomModal("An error has occurred.", msg, true, onclose)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (success) {
        const msg = decodeURIComponent(success);
        const modal = decodeURIComponent(openmodal);
        const onclose = () => {
            if (openmodal) openModal(modal);
            if (firstLogin) startTutorial();
        }
        openCustomModal(msg, "", true, onclose)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
