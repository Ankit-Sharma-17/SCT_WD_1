const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modePvP = document.getElementById('modePvP');
const modePvC = document.getElementById('modePvC');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');
const playerXNameEl = document.getElementById('playerXName');
const playerONameEl = document.getElementById('playerOName');
const resetScoresBtn = document.getElementById('resetScoresBtn');
const confettiCanvas = document.getElementById('confetti-canvas');
const darkModeToggle = document.getElementById('darkModeToggle');
const iconSpan = darkModeToggle.querySelector('.icon i');
const textSpan = darkModeToggle.querySelector('.toggle-text');
const body = document.body;

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let mode = 'PvP'; // 'PvP' or 'PvC'
let score = { X: 0, O: 0, draw: 0 };
let playerNames = { X: 'Player X', O: 'Player O' };
let darkMode = false;

// Sound effects
const moveSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
const winSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
moveSound.volume = 0.2;
winSound.volume = 0.4;

// Persistent scoreboard
function loadScoreboard() {
  const saved = localStorage.getItem('tictactoe-score');
  if (saved) score = JSON.parse(saved);
  updateScoreboard();
}
function saveScoreboard() {
  localStorage.setItem('tictactoe-score', JSON.stringify(score));
}
function resetScoreboard() {
  score = { X: 0, O: 0, draw: 0 };
  updateScoreboard();
  saveScoreboard();
}
resetScoresBtn.addEventListener('click', resetScoreboard);

// Player names
function loadPlayerNames() {
  const saved = localStorage.getItem('tictactoe-names');
  if (saved) playerNames = JSON.parse(saved);
  playerXNameEl.value = playerNames.X;
  playerONameEl.value = playerNames.O;
}
function savePlayerNames() {
  localStorage.setItem('tictactoe-names', JSON.stringify(playerNames));
}
playerXNameEl.addEventListener('input', e => {
  playerNames.X = e.target.value || 'Player X';
  savePlayerNames();
  updateStatus();
});
playerONameEl.addEventListener('input', e => {
  playerNames.O = e.target.value || 'Player O';
  savePlayerNames();
  updateStatus();
});

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.tabIndex = 0;
    cellEl.textContent = cell ? cell : '';
    cellEl.addEventListener('click', () => handleCellClick(idx, cellEl));
    cellEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') handleCellClick(idx, cellEl); });
    boardEl.appendChild(cellEl);
  });
}

function handleCellClick(idx, cellEl) {
  if (!gameActive || board[idx]) return;
  board[idx] = currentPlayer;
  animateCell(cellEl);
  playMoveSound();
  renderBoard();
  const winner = checkWinner();
  if (winner) {
    endGame(winner);
    return;
  }
  if (board.every(cell => cell)) {
    endGame('draw');
    return;
  }
  if (mode === 'PvC' && currentPlayer === 'X') {
    currentPlayer = 'O';
    updateStatus();
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

function animateCell(cellEl) {
  if (!cellEl) return;
  cellEl.style.transform = 'scale(1.15)';
  setTimeout(() => { cellEl.style.transform = ''; }, 180);
}

function playMoveSound() {
  moveSound.currentTime = 0;
  moveSound.play();
}
function playWinSound() {
  winSound.currentTime = 0;
  winSound.play();
}

function computerMove() {
  if (!gameActive) return;
  // Simple AI: pick random empty cell
  const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
  if (empty.length === 0) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  board[idx] = 'O';
  renderBoard();
  playMoveSound();
  const winner = checkWinner();
  if (winner) {
    endGame(winner);
    return;
  }
  if (board.every(cell => cell)) {
    endGame('draw');
    return;
  }
  currentPlayer = 'X';
  updateStatus();
}

function checkWinner() {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWinner([a,b,c]);
      return board[a];
    }
  }
  return null;
}

function highlightWinner(indices) {
  const cells = boardEl.querySelectorAll('.cell');
  indices.forEach(i => cells[i].classList.add('winner'));
}

function endGame(winner) {
  gameActive = false;
  playWinSound();
  if (winner === 'draw') {
    statusEl.textContent = "It's a draw!";
    score.draw++;
  } else if (mode === 'PvC' && winner === 'O') {
    statusEl.textContent = "Computer wins!";
    score.O++;
    showConfetti();
  } else {
    statusEl.textContent = `${playerNames[winner] || 'Player ' + winner} wins!`;
    score[winner]++;
    showConfetti();
  }
  updateScoreboard();
  saveScoreboard();
}

function updateScoreboard() {
  scoreXEl.textContent = score.X;
  scoreOEl.textContent = score.O;
  scoreDrawEl.textContent = score.draw;
}

function updateStatus() {
  if (!gameActive) return;
  if (mode === 'PvC' && currentPlayer === 'O') {
    statusEl.textContent = "Computer's turn";
  } else {
    statusEl.textContent = `${playerNames[currentPlayer] || 'Player ' + currentPlayer}'s turn`;
  }
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  renderBoard();
  updateStatus();
}

modePvP.addEventListener('click', () => {
  mode = 'PvP';
  modePvP.classList.add('selected');
  modePvC.classList.remove('selected');
  resetGame();
});
modePvC.addEventListener('click', () => {
  mode = 'PvC';
  modePvC.classList.add('selected');
  modePvP.classList.remove('selected');
  resetGame();
});
resetBtn.addEventListener('click', resetGame);

// Confetti animation (simple burst)
function showConfetti() {
  const canvas = confettiCanvas;
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'block';
  const colors = ['#ff4c60', '#6366f1', '#fff', '#ffb3b3', '#60a5fa'];
  let particles = Array.from({length: 40}, () => ({
    x: canvas.width/2,
    y: canvas.height/2,
    r: Math.random()*6+4,
    c: colors[Math.floor(Math.random()*colors.length)],
    vx: (Math.random()-0.5)*8,
    vy: (Math.random()-0.7)*10,
    g: 0.3+Math.random()*0.2
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
      ctx.fillStyle = p.c;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
    });
    frame++;
    if (frame < 60) requestAnimationFrame(draw);
    else canvas.style.display = 'none';
  }
  draw();
}

// Dark mode toggle
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
  localStorage.setItem('tictactoeDarkMode', enabled ? '1' : '0');
}

darkModeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});

// On load, set mode from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tictactoeDarkMode');
  setDarkMode(saved === '1');
});

// Dark mode CSS
const darkModeStyle = document.createElement('style');
darkModeStyle.innerHTML = `
  body.dark-mode {
    background: linear-gradient(135deg, #181c23 0%, #232946 100%) !important;
  }
  body.dark-mode .glass-card {
    background: rgba(35, 42, 54, 0.92) !important;
    border-color: #232946 !important;
  }
  body.dark-mode .mode-btn.selected, body.dark-mode .selected-filter {
    background: linear-gradient(90deg, #6366f1, #ff4c60) !important;
    color: #fff !important;
  }
  body.dark-mode .mode-btn, body.dark-mode .tictactoe-board .cell {
    background: #232946 !important;
    color: #fff !important;
    border-color: #6366f1 !important;
  }
  body.dark-mode .tictactoe-board .cell.winner {
    background: #ff4c60 !important;
    color: #fff !important;
    border-color: #fff !important;
  }
  body.dark-mode .tictactoe-board .cell:hover, body.dark-mode .tictactoe-board .cell:focus {
    background: #2d3e50 !important;
    color: #ff7c7c !important;
    border-color: #ff7c7c !important;
  }
`;
document.head.appendChild(darkModeStyle);

// Init
loadScoreboard();
loadPlayerNames();
renderBoard();
updateStatus();
updateScoreboard(); 