/*
note:
Date.getTime() returns the difference between the current time
and January 1 1970 00:00:00 in milliseconds
(see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
*/

const webTimer = document.querySelector("#js-landing-timer");

const targetTime = new Date("Apr 20, 2025 16:00:00").getTime(); // placeholder for now

let timerFunc = setInterval(() => {
  let currentTime = new Date().getTime();
  let timeDistance = targetTime - currentTime;

  // multiply seconds, minutes, and hours to milliseconds to get all milliseconds in a day
  let hours = Math.floor((timeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDistance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDistance % (1000 * 60)) / 1000);

  let timerHours = (hours > 0) ? ((hours < 10) ? ("0" + hours) : (hours)) : ("00");
  let timerMinutes = (minutes > 0) ? ((minutes < 10) ? ("0" + minutes) : (minutes)) : ("00");
  let timerSeconds = (seconds > 0) ? ((seconds < 10) ? ("0" + seconds) : (seconds)) : ("00");

  webTimer.innerText = timerHours + ":" + timerMinutes + ":" + timerSeconds;

  if (timeDistance < 0) {
    clearInterval(timerFunc);
    webTimer.innerText = "00:00:00";
  }
});

