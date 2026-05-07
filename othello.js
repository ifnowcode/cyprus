const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const SIZE = 8;
const TILE = canvas.width / SIZE;

const EMPTY = 0;
const BLACK = 1; // human
const WHITE = 2; // computer

let board = [];
let currentPlayer = BLACK; // human starts

const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];

function initBoard() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  const mid = SIZE / 2;
  // Standard Othello setup
  board[mid - 1][mid - 1] = WHITE;
  board[mid][mid] = WHITE;
  board[mid - 1][mid] = BLACK;
  board[mid][mid - 1] = BLACK;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0a7a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  for (let i = 0; i <= SIZE; i++) {
    const pos = i * TILE;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
    ctx.stroke();
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        drawPiece(r, c, board[r][c]);
      }
    }
  }
}

function drawPiece(row, col, color) {
  const x = col * TILE + TILE / 2;
  const y = row * TILE + TILE / 2;
  const radius = TILE * 0.4;
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color === BLACK ? '#111' : '#eee';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  
  /*
  ctx.save();
  ctx.fillStyle = color === BLACK ? '#111' : '#eee';
  ctx.font = "28px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(color === BLACK ? '💀' : '🩸', x, y);
  ctx.restore();
  */
}

function inBounds(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function flipsForMove(r, c, player, boardState = board) {
  if (boardState[r][c] !== EMPTY) return [];
  const opponent = player === BLACK ? WHITE : BLACK;
  let flips = [];

  for (const [dr, dc] of DIRS) {
    let rr = r + dr;
    let cc = c + dc;
    let line = [];

    while (inBounds(rr, cc) && boardState[rr][cc] === opponent) {
      line.push([rr, cc]);
      rr += dr;
      cc += dc;
    }

    if (line.length > 0 && inBounds(rr, cc) && boardState[rr][cc] === player) {
      flips = flips.concat(line);
    }
  }

  return flips;
}

function hasAnyMove(player) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (flipsForMove(r, c, player).length > 0) return true;
    }
  }
  return false;
}

function applyMove(r, c, player) {
  const flips = flipsForMove(r, c, player);
  if (flips.length === 0) return false;

  board[r][c] = player;
  for (const [fr, fc] of flips) {
    board[fr][fc] = player;
  }
  return true;
}

function getScore() {
  let black = 0, white = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === BLACK) black++;
      if (board[r][c] === WHITE) white++;
    }
  }
  return { black, white };
}

function gameOver() {
  return !hasAnyMove(BLACK) && !hasAnyMove(WHITE);
}

function updateStatus() {
  const { black, white } = getScore();
  if (gameOver()) {
    let msg = `Game over. Black: ${black}, White: ${white}. `;
    if (black > white) msg += "You win!";
    else if (white > black) msg += "Computer wins.";
    else msg += "It's a tie.";
    statusEl.textContent = msg;
  } else {
    statusEl.textContent = currentPlayer === BLACK
      ? `Your turn (Black). Score — Black: ${black}, White: ${white}`
      : `Computer thinking... Score — Black: ${black}, White: ${white}`;
  }
}

function computerMove() {
  if (!hasAnyMove(WHITE)) {
    currentPlayer = BLACK;
    updateStatus();
    drawBoard();
    return;
  }

  let bestMoves = [];
  let bestFlips = 0;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const flips = flipsForMove(r, c, WHITE);
      if (flips.length > 0) {
        if (flips.length > bestFlips) {
          bestFlips = flips.length;
          bestMoves = [[r, c]];
        } else if (flips.length === bestFlips) {
          bestMoves.push([r, c]);
        }
      }
    }
  }

  if (bestMoves.length === 0) {
    currentPlayer = BLACK;
    updateStatus();
    drawBoard();
    return;
  }

  const [r, c] = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  applyMove(r, c, WHITE);
  currentPlayer = BLACK;
  drawBoard();
  updateStatus();
}

function handleClick(evt) {
  if (currentPlayer !== BLACK || gameOver()) return;

  const rect = canvas.getBoundingClientRect();
  const x = (evt.clientX - rect.left) * (canvas.width / rect.width);
  const y = (evt.clientY - rect.top) * (canvas.height / rect.height);

  const c = Math.floor(x / TILE);
  const r = Math.floor(y / TILE);

  if (!inBounds(r, c)) return;

  if (!applyMove(r, c, BLACK)) return;

  drawBoard();

  if (!hasAnyMove(WHITE) && !hasAnyMove(BLACK)) {
    updateStatus();
    return;
  }

  currentPlayer = WHITE;
  updateStatus();

  setTimeout(() => {
    computerMove();
  }, 300);
}

canvas.addEventListener('click', handleClick);

initBoard();
drawBoard();
updateStatus();