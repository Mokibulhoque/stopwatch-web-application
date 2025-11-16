const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const lapsList = document.getElementById("laps-list");

let startTime = 0;       // timestamp when started
let elapsedTime = 0;     // ms already counted
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

// format ms -> "hh:mm:ss.cc"
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");
  const cs = String(centiseconds).padStart(2, "0");

  return `${h}:${m}:${s}.${cs}`;
}

function updateDisplay() {
  const now = Date.now();
  const diff = now - startTime + elapsedTime;
  timeDisplay.textContent = formatTime(diff);
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startTime = Date.now();
  timerInterval = setInterval(updateDisplay, 10);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function pauseTimer() {
  if (!isRunning) return;

  isRunning = false;
  clearInterval(timerInterval);
  // update elapsed with last segment
  elapsedTime += Date.now() - startTime;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  lapCount = 0;
  timeDisplay.textContent = "00:00:00.00";
  lapsList.innerHTML = "";

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;
}

function recordLap() {
  if (!isRunning && elapsedTime === 0) return;

  const currentTime = timeDisplay.textContent;
  lapCount += 1;

  const li = document.createElement("li");
  const labelSpan = document.createElement("span");
  const timeSpan = document.createElement("span");

  labelSpan.textContent = `Lap ${lapCount}`;
  timeSpan.textContent = currentTime;

  li.appendChild(labelSpan);
  li.appendChild(timeSpan);
  lapsList.prepend(li); // latest lap on top
}

// EVENT LISTENERS
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
