function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function getCharacters() {
  const raw = localStorage.getItem("characters");
  return raw ? JSON.parse(raw) : [];
}

function setStatus(message, type = "info") {
  const el = document.getElementById("status");
  el.textContent = message || "";
  el.className = `status status-${type}`;
}

function flashCell(cell, className) {
  cell.classList.add(className);
  window.setTimeout(() => {
    cell.classList.remove(className);
  }, 260);
}

function speakChinese(text) {
  if (!("speechSynthesis" in window)) {
    setStatus("Speech is not supported in this browser.", "error");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  setStatus("Pronunciation played. Listen and repeat.", "info");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getPuzzleTargetHanzi(hanzi) {
  const normalized = String(hanzi || "").replace(/\s+/g, "").trim();
  return Array.from(normalized)[0] || "?";
}

function makePiecesFromHanzi(hanzi) {
  const tile = 120;
  const canvasSize = tile * 3;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#ffffff";
  const fontSize = Math.floor(canvasSize * 0.5);
  ctx.font = `900 ${fontSize}px "Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    hanzi,
    canvasSize / 2,
    canvasSize / 2
  );

  const fullCharacterDataUrl = canvas.toDataURL("image/png");

  const pieces = [];
  let id = 0;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      pieces.push({
        id: String(id),
        correctRow: row,
        correctCol: col,
        dataUrl: fullCharacterDataUrl,
      });
      id++;
    }
  }

  return { pieces };
}

function markDropTargets(active) {
  const cells = document.querySelectorAll("#board .cell, #tray .cell");
  cells.forEach((cell) => {
    cell.classList.remove("drop-target");
    if (active && !cell.querySelector(".piece")) {
      cell.classList.add("drop-target");
    }
  });
}

function clearDropUi() {
  const cells = document.querySelectorAll("#board .cell, #tray .cell");
  cells.forEach((cell) => {
    cell.classList.remove("drop-target", "drop-hover");
  });
}

function buildGrid(container, isBoard) {
  container.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.slot = String(i);

    cell.addEventListener("dragover", (e) => e.preventDefault());

    if (isBoard) {
      cell.addEventListener("dragenter", (e) => {
        e.preventDefault();
        if (!cell.querySelector(".piece")) {
          cell.classList.add("drop-hover");
        }
      });
      cell.addEventListener("dragleave", () => {
        cell.classList.remove("drop-hover");
      });
      cell.addEventListener("drop", (e) => onDropToCell(e, cell));
    } else {
      cell.addEventListener("dragenter", (e) => {
        e.preventDefault();
        if (!cell.querySelector(".piece")) {
          cell.classList.add("drop-hover");
        }
      });
      cell.addEventListener("dragleave", () => {
        cell.classList.remove("drop-hover");
      });
      cell.addEventListener("drop", (e) => onDropToTrayCell(e, cell));
    }

    container.appendChild(cell);
  }

  if (!isBoard) {
    container.ondragover = (e) => e.preventDefault();
    container.ondrop = (e) => onDropToTray(e);
  }
}

function createPieceElement(piece) {
  const el = document.createElement("div");
  el.className = "piece";
  el.draggable = true;
  el.dataset.pieceId = piece.id;
  el.style.backgroundImage = `url("${piece.dataUrl}")`;
  el.style.backgroundSize = "300% 300%";
  el.style.backgroundPosition = `${piece.correctCol * 50}% ${piece.correctRow * 50}%`;
  el.style.backgroundRepeat = "no-repeat";

  el.addEventListener("dragstart", (e) => {
    if (el.classList.contains("locked")) {
      e.preventDefault();
      return;
    }
    state.draggingPieceId = piece.id;
    el.classList.add("dragging");
    markDropTargets(true);
    e.dataTransfer.setData("text/pieceId", piece.id);
  });

  el.addEventListener("dragend", () => {
    state.draggingPieceId = null;
    el.classList.remove("dragging");
    clearDropUi();
  });

  return el;
}

function updateProgress() {
  const level = localStorage.getItem("hskLevel") || "-";
  const total = state.chars.length;
  const current = total > 0 ? Math.min(state.index + 1, total) : 0;

  document.getElementById("progress-level").textContent = `HSK ${level}`;
  document.getElementById("progress-count").textContent = `Character ${current}/${total}`;
  document.getElementById("progress-score").textContent = `Score ${state.score}`;
}

function checkWin() {
  const board = document.getElementById("board");
  const lockedCount = board.querySelectorAll(".piece.locked").length;

  if (lockedCount === 9) {
    state.score += 20;
    updateProgress();
    setStatus("Excellent! Character complete. Loading the next one...", "win");
    window.setTimeout(nextCharacter, 900);
  }
}

function onDropToCell(e, cell) {
  e.preventDefault();
  cell.classList.remove("drop-hover");

  const pieceId = e.dataTransfer.getData("text/pieceId");
  if (!pieceId) return;

  if (cell.querySelector(".piece")) {
    setStatus("This cell is already filled. Try another one.", "info");
    return;
  }

  const pieceEl = document.querySelector(`.piece[data-piece-id="${pieceId}"]`);
  if (!pieceEl || pieceEl.classList.contains("locked")) return;

  cell.appendChild(pieceEl);

  const slot = Number(cell.dataset.slot);
  const correctId = String(slot);

  if (pieceId === correctId) {
    pieceEl.classList.add("locked");
    state.score += 10;
    flashCell(cell, "feedback-correct");
    setStatus("Great job. Correct piece locked in place.", "success");
  } else {
    state.score = Math.max(0, state.score - 1);
    flashCell(cell, "feedback-wrong");
    setStatus("Not this spot yet. Keep trying.", "error");
  }

  updateProgress();
  checkWin();
}

function onDropToTray(e) {
  e.preventDefault();

  const pieceId = e.dataTransfer.getData("text/pieceId");
  if (!pieceId) return;

  const tray = document.getElementById("tray");
  const pieceEl = document.querySelector(`.piece[data-piece-id="${pieceId}"]`);
  if (!pieceEl || pieceEl.classList.contains("locked")) return;

  const trayCells = [...tray.querySelectorAll(".cell")];
  const emptyCell = trayCells.find((c) => !c.querySelector(".piece"));
  if (!emptyCell) return;

  emptyCell.appendChild(pieceEl);
  setStatus("Piece returned to tray.", "info");
}

function onDropToTrayCell(e, cell) {
  e.preventDefault();
  cell.classList.remove("drop-hover");

  const pieceId = e.dataTransfer.getData("text/pieceId");
  if (!pieceId || cell.querySelector(".piece")) return;

  const pieceEl = document.querySelector(`.piece[data-piece-id="${pieceId}"]`);
  if (!pieceEl || pieceEl.classList.contains("locked")) return;

  cell.appendChild(pieceEl);
  setStatus("Piece moved to tray.", "info");
}

function updateHintPreview(hanzi) {
  const hint = document.getElementById("boardHint");
  if (!hint) return;
  hint.textContent = getPuzzleTargetHanzi(hanzi);
}

function toggleHint() {
  const stack = document.getElementById("boardStack");
  const btn = document.getElementById("hintToggleBtn");
  if (!stack || !btn) return;

  const visible = stack.classList.toggle("hint-visible");
  btn.textContent = visible ? "Hide Hint" : "Show Hint";
  btn.setAttribute("aria-pressed", String(visible));
}

function renderCharacter() {
  const currentChar = state.chars[state.index];
  if (!currentChar) return;

  const puzzleHanzi = getPuzzleTargetHanzi(currentChar.hanzi);
  document.getElementById("hanzi").textContent = puzzleHanzi;
  document.getElementById("pinyin").textContent = currentChar.pinyin || "-";
  document.getElementById("meaning").textContent = currentChar.meaning || "-";
  updateHintPreview(puzzleHanzi);
  updateProgress();
}

function startPuzzleForCurrentChar() {
  const board = document.getElementById("board");
  const tray = document.getElementById("tray");

  buildGrid(board, true);
  buildGrid(tray, false);

  const currentChar = state.chars[state.index];
  const { pieces } = makePiecesFromHanzi(getPuzzleTargetHanzi(currentChar.hanzi));

  const pieceEls = pieces.map((piece) => createPieceElement(piece));
  shuffleArray(pieceEls);

  const trayCells = [...tray.querySelectorAll(".cell")];
  trayCells.forEach((cell) => {
    cell.innerHTML = "";
  });

  pieceEls.forEach((pieceEl, index) => {
    if (trayCells[index]) {
      trayCells[index].appendChild(pieceEl);
    }
  });

  clearDropUi();
}

function shufflePieces() {
  const tray = document.getElementById("tray");
  const board = document.getElementById("board");

  const trayCells = [...tray.querySelectorAll(".cell")];
  const trayPieces = [...tray.querySelectorAll(".piece")];
  const unlockedBoardPieces = [...board.querySelectorAll(".piece:not(.locked)")];

  trayCells.forEach((cell) => {
    cell.innerHTML = "";
  });

  const allMovablePieces = [...trayPieces, ...unlockedBoardPieces];
  shuffleArray(allMovablePieces);

  allMovablePieces.forEach((piece, index) => {
    if (trayCells[index]) {
      trayCells[index].appendChild(piece);
    }
  });

  setStatus("Unsolved pieces shuffled.", "info");
}

function nextCharacter() {
  state.index++;

  if (state.index >= state.chars.length) {
    updateProgress();
    setStatus("Session complete. You finished all characters.", "win");
    return;
  }

  renderCharacter();
  startPuzzleForCurrentChar();
  setStatus("New character loaded. Start with any tray piece.", "info");
}

function setupMusic() {
  state.music = new Audio("./audio/study.mp3");
  state.music.loop = true;
  state.music.volume = 0.35;
}

function toggleMusic() {
  if (!state.music) setupMusic();

  state.musicOn = !state.musicOn;
  const btn = document.getElementById("musicBtn");

  if (state.musicOn) {
    state.music.play().catch(() => {});
    btn.textContent = "Background Music: On";
    setStatus("Background music is on.", "info");
  } else {
    state.music.pause();
    btn.textContent = "Background Music: Off";
    setStatus("Background music is off.", "info");
  }
}

const state = {
  chars: [],
  index: 0,
  score: 0,
  musicOn: false,
  music: null,
  draggingPieceId: null,
};

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const chars = getCharacters();
  if (!chars || chars.length === 0) {
    window.location.href = "game.html";
    return;
  }

  state.chars = chars;
  state.index = 0;
  state.score = 0;

  renderCharacter();
  startPuzzleForCurrentChar();
  setStatus("Drag a piece from the tray to begin.", "info");

  document.getElementById("shuffleBtn").addEventListener("click", shufflePieces);
  document.getElementById("levelsBtn").addEventListener("click", () => {
    window.location.href = "game.html";
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("characters");
    localStorage.removeItem("hskLevel");
    window.location.href = "login.html";
  });

  document.getElementById("musicBtn").addEventListener("click", toggleMusic);
  document.getElementById("speakBtn").addEventListener("click", () => {
    const currentChar = state.chars[state.index];
    speakChinese(currentChar.hanzi || "");
  });
  document.getElementById("hintToggleBtn").addEventListener("click", toggleHint);

  setupMusic();
});
