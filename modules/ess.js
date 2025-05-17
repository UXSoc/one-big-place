const { DateTime } = require('luxon');

function generateRandomSeed() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function getCurrentDate() {
    return DateTime.now().setZone("Asia/Manila");
}
  
function timeBetw(startTime, endTime) {
    const currentDate = getCurrentDate();

    const [startH, startM, startS] = startTime.split(":").map(Number);
    const [endH, endM, endS] = endTime.split(":").map(Number);

    let startDate = currentDate.set({ hour: startH, minute: startM, second: startS, millisecond: 0 });
    let endDate = currentDate.set({ hour: endH, minute: endM, second: endS, millisecond: 0 });

    if (endDate <= startDate) {
        if (currentDate < endDate) {
            startDate = startDate.minus({ days: 1 });
        } else {
            endDate = endDate.plus({ days: 1 });
        }
    }

    return currentDate >= startDate && currentDate < endDate;
}

const schedule = require('node-schedule');
require('dotenv').config()

const closingDate = DateTime.fromFormat(process.env.CLOSING_DATE, "LLL d, yyyy HH:mm:ss", { zone: "Asia/Manila" });
function isEventClosed() {
  const now = getCurrentDate();
  return (now > closingDate);
}

let eventClosed = isEventClosed();
const closeSchedule = schedule.scheduleJob(closingDate.toJSDate(), () => {
    const canvas = require('./canvas');
    eventClosed = true;
    console.log("Closing Event... Saving Data...")
    canvas.saveFrame();
    canvas.saveCanvasData();
});

module.exports = {
    generateRandomSeed: generateRandomSeed,
    getCurrentDate: getCurrentDate,
    timeBetw: timeBetw,
    isEventClosed: isEventClosed,
}