let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;
let laps = [];

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('laps');

// --- Dark Mode Toggle Logic ---
const darkModeToggle = document.getElementById('darkModeToggle');
const iconSpan = darkModeToggle.querySelector('.icon i');
const textSpan = darkModeToggle.querySelector('.toggle-text');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark-mode');
    iconSpan.className = 'fas fa-sun';
    textSpan.textContent = 'Light Mode';
  } else {
    body.classList.remove('dark-mode');
    iconSpan.className = 'fas fa-moon';
    textSpan.textContent = 'Dark Mode';
  }
  localStorage.setItem('stopwatchDarkMode', enabled ? '1' : '0');
}

darkModeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});

// On load, set mode from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('stopwatchDarkMode');
  setDarkMode(saved === '1');
});

function formatTime(ms) {
  const date = new Date(ms);
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  const msStr = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${h}:${m}:${s}.${msStr}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function startTimer() {
  if (!running) {
    running = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 10);
    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
  }
}

function pauseTimer() {
  if (running) {
    running = false;
    clearInterval(timerInterval);
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
  }
}

function resetTimer() {
  running = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  updateDisplay();
  startBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
  laps = [];
  renderLaps();
}

function lapTimer() {
  if (running) {
    laps.push(elapsedTime);
    renderLaps();
  }
}

function renderLaps() {
  lapsList.innerHTML = '';
  laps.forEach((lap, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>Lap ${idx + 1}</span><span>${formatTime(lap)}</span>`;
    lapsList.appendChild(li);
  });
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', lapTimer);

updateDisplay();
renderLaps(); 