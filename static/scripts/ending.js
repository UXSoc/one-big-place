const closingTimer = document.querySelector('.panner_interface > .closing-timer');

export async function startEndingCountdown() {
    const res = await fetch(`/json/closing-date?ts=${Date.now()}`);
    const data = await res.json();
    const targetTime = new Date(data.closingDate);
    let timerFunc = setInterval(() => {
      let currentTime = new Date().getTime();
      let timeDistance = targetTime - currentTime;
    
      if (timeDistance < 0) {
        clearInterval(timerFunc);
        webTimer.innerText = "00:00:00";
        location.reload(true);
      }
    
      // multiply seconds, minutes, and hours to milliseconds to get all milliseconds in a day
      let totalSeconds = Math.floor(timeDistance / 1000);
      let hours = Math.floor(totalSeconds / 3600);
      let minutes = Math.floor((totalSeconds % 3600) / 60);
      let seconds = totalSeconds % 60;
    
      let timerHours = hours < 10 ? "0" + hours : hours;
      let timerMinutes = minutes < 10 ? "0" + minutes : minutes;
      let timerSeconds = seconds < 10 ? "0" + seconds : seconds;

      closingTimer.style.opacity = `${Math.min(1,(72-hours)/72)}`
      closingTimer.style.scale = `${Math.min(1,(72-hours)/72)}`
    
      closingTimer.innerText = `${timerHours}:${timerMinutes}:${timerSeconds}`;
    });
}