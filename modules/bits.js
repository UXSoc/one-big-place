const cooldown = 15;
const frnzy_cooldown = 10;
let frnzy_active = false;

function getCooldown() { return frnzy_active?frnzy_cooldown:cooldown; }

function calculateBits(current_bits, max_bits, last_place_date, extra_time) {
    var now = new Date;
    var date_difference = (now-last_place_date)/1000;
    if (isNaN(date_difference)) {
        date_difference = (now-Date.parse(last_place_date))/1000;
    }
    new_pixels = Math.floor((date_difference+extra_time)/getCooldown());
    current_bits = Math.min(current_bits+new_pixels, max_bits);
    extra_time = (current_bits==max_bits)?0:(date_difference+extra_time)%getCooldown();
    return [current_bits, extra_time];
}

module.exports = {
    calculateBits: calculateBits,
}