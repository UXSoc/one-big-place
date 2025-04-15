import { openCustomModal, openModal } from "./modals.js";

export function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    // Display error message if exists
    if (error) {
        const msg = decodeURIComponent(error);
        onclose = (msg=="Invalid username or password")?() => {openModal('login')}:() => {}; 
        openCustomModal("An error has occurred.", msg, true, onclose)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Display success message if exists
    if (success) {
        openCustomModal("Logged in successfully.", decodeURIComponent(success))
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
