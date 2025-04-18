import { openCustomModal } from "./modals.js";
import { socket } from "./socket.js";

async function redeem(redeemCode) {
    try {
        const response = await fetch('/redeem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                redeemCode: redeemCode.toLowerCase()
            })
        });

        const data = await response.json();
        if (!response.ok) {
            openCustomModal("Error Redeeming", data.error)
            console.error('Error redeeming bonus:', data.error);
        } else {
            openCustomModal("Redeemed Code!", data.message)
            socket.emit('req_bit_sync');
        }
    } catch (err) {
        openCustomModal("Error Redeeming", err)
    }
}
document.querySelector('form.redeem').addEventListener('submit', (e) => {
    e.preventDefault();
    const redeemInput = e.target.querySelector('input');
    if (redeemInput.value == "") return;
    redeem(redeemInput.value);
    redeemInput.value = '';
})