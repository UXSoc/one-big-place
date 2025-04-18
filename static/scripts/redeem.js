import { openCustomModal } from "./modals.js";
import { socket } from "./socket.js";

export async function redeem(redeemCode, openModal=true) {
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
            if (openModal) openCustomModal("Error Redeeming", data.error)
            console.error('Error redeeming bonus:', data.error);
        } else {
            if (openModal) openCustomModal("Redeemed Code!", data.message)
            socket.emit('req_bit_sync');
        }
    } catch (err) {
        if (openModal) openCustomModal("Error Redeeming", err)
    }
}