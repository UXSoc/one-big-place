import { openCustomModal } from "./modals.js";

export function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    // Display error message if exists
    if (error) {
        openCustomModal("An error has occurred.", decodeURIComponent(error))
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Display success message if exists
    if (success) {
        openCustomModal("Logged in successfully.", decodeURIComponent(success))
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
