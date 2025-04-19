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

  if (timeDistance < 0) {
    clearInterval(timerFunc);
    webTimer.innerText = "00:00:00";
  }

  // multiply seconds, minutes, and hours to milliseconds to get all milliseconds in a day
  let totalSeconds = Math.floor(timeDistance / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  let timerHours = hours < 10 ? "0" + hours : hours;
  let timerMinutes = minutes < 10 ? "0" + minutes : minutes;
  let timerSeconds = seconds < 10 ? "0" + seconds : seconds;

  webTimer.innerText = `${timerHours}:${timerMinutes}:${timerSeconds}`;
});

