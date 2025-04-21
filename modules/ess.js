function generateRandomSeed() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function getCurrentDate() {
    const manilaStr = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    return new Date(manilaStr);
  }
  
function timeBetw(startTime, endTime) {
    const currentDate = getCurrentDate();
    const [startH, startM, startS] = startTime.split(":").map(Number);
    const [endH, endM, endS] = endTime.split(":").map(Number);
    const startDate = new Date(currentDate.getTime());
    startDate.setHours(startH, startM, startS, 0);
    const endDate = new Date(currentDate.getTime());
    endDate.setHours(endH, endM, endS, 0);
    if (endDate <= startDate) {
        if (currentDate >= startDate) {
            return true;
        } else {
            endDate.setDate(endDate.getDate() + 1);
            return currentDate < endDate;
        }
    }
    return currentDate >= startDate && currentDate < endDate;
}

function convertTZ(date) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "Asia/Taipei"}));   
}

const schedule = require('node-schedule');
require('dotenv').config()

const closingDate = new Date(process.env.CLOSING_DATE);
function isEventClosed() {
  const now = new Date();
  return (now > closingDate);
}

let eventClosed = isEventClosed();
const closeSchedule = schedule.scheduleJob(closingDate, () => {
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
    convertTZ: convertTZ,
    isEventClosed: isEventClosed,
}