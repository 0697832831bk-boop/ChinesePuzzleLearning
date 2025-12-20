// public/js/jigsaw.js

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function getCharacters() {
  const raw = localStorage.getItem("characters");
  return raw ? JSON.parse(raw) : [];
}

function setStatus(msg, isWin = false) {
  const el = document.getElementById("status");
  el.textContent = msg || "";
  el.className = "status" + (isWin ? " win" : "");
}

function speakChinese(text) {
  if (!("speechSynthesis" in window)) {
    alert("Speech is not supported in this browser.");
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ✅ FIXED: Build a 3x3 image from hanzi drawn on canvas and slice it
function makePiecesFromHanzi(hanzi) {
  const tray = document.getElementById("tray");
  const rect = tray.getBoundingClientRect();

  const size = Math.floor(rect.width);
  const gap = 10; // must match CSS --gap

  // ✅ Real cell size = (size - padding*2 - gap*2) / 3
  // padding = gap (gridBox padding: var(--gap))
  const tile = Math.floor((size - (gap * 2) - (gap * 2)) / 3);

  // ✅ Canvas size must be exactly tile*3 so slices fit perfectly (no cut)
  const canvasSize = tile * 3;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#ffffff";

  const fontSize = Math.floor(canvasSize * 0.72);
  ctx.font = `900 ${fontSize}px "Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(hanzi, canvasSize / 2, canvasSize / 2);

  const pieces = [];
  let id = 0;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const pieceCanvas = document.createElement("canvas");
      pieceCanvas.width = tile;
      pieceCanvas.height = tile;

      const pctx = pieceCanvas.getContext("2d");
      pctx.drawImage(
        canvas,
        c * tile,
        r * tile,
        tile,
        tile,
        0,
        0,
        tile,
        tile
      );

      pieces.push({
        id: String(id),
        correctRow: r,
        correctCol: c,
        dataUrl: pieceCanvas.toDataURL("image/png"),
      });
      id++;
    }
  }

  return { pieces, tile };
}

function buildGrid(container, isBoard) {
  container.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.slot = String(i);

    // Allow drop
    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => onDropToCell(e, cell));

    container.appendChild(cell);
  }

  if (!isBoard) {
    // tray should also accept drops (return piece back)
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", (e) => onDropToTray(e));
  }
}

function createPieceElement(piece) {
  const el = document.createElement("div");
  el.className = "piece";
  el.draggable = true;
  el.dataset.pieceId = piece.id;
  el.style.backgroundImage = `url("${piece.dataUrl}")`;

  el.addEventListener("dragstart", (e) => {
    if (el.classList.contains("locked")) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/pieceId", piece.id);
  });

  return el;
}

let state = {
  chars: [],
  index: 0,
  pieces: [],
  placed: new Map(),
  musicOn: false,
  music: null,
};

function onDropToCell(e, cell) {
  e.preventDefault();
  const pieceId = e.dataTransfer.getData("text/pieceId");
  if (!pieceId) return;

  if (cell.querySelector(".piece")) return;

  const pieceEl = document.querySelector(`.piece[data-piece-id="${pieceId}"]`);
  if (!pieceEl) return;

  cell.appendChild(pieceEl);

  const slot = Number(cell.dataset.slot);
  const correctId = String(slot);

  if (pieceId === correctId) {
    pieceEl.classList.add("locked");
    setStatus("Nice! ✅");
  } else {
    setStatus("Not correct — try again 🙂");
  }

  checkWin();
}

function onDropToTray(e) {
  e.preventDefault();
  const pieceId = e.dataTransfer.getData("text/pieceId");
  if (!pieceId) return;

  const tray = document.getElementById("tray");
  const pieceEl = document.querySelector(`.piece[data-piece-id="${pieceId}"]`);
  if (!pieceEl) return;

  if (pieceEl.classList.contains("locked")) return;

  const trayCells = [...tray.querySelectorAll(".cell")];
  const empty = trayCells.find((c) => !c.querySelector(".piece"));
  if (empty) empty.appendChild(pieceEl);
}

function checkWin() {
  const board = document.getElementById("board");
  const lockedCount = board.querySelectorAll(".piece.locked").length;
  if (lockedCount === 9) {
    setStatus("Completed! 🎉 Next character loading…", true);
    setTimeout(nextCharacter, 800);
  }
}

function renderCharacter() {
  const ch = state.chars[state.index];
  if (!ch) return;

  document.getElementById("hanzi").textContent = ch.hanzi || "?";
  document.getElementById("pinyin").textContent = ch.pinyin || "";
  document.getElementById("meaning").textContent = ch.meaning || "";

  const level = localStorage.getItem("hskLevel") || "?";
  document.getElementById("progress").textContent =
    `HSK ${level} • Character ${state.index + 1} / ${state.chars.length}`;
}

function startPuzzleForCurrentChar() {
  setStatus("");

  const board = document.getElementById("board");
  const tray = document.getElementById("tray");

  buildGrid(board, true);
  buildGrid(tray, false);

  const ch = state.chars[state.index];
  const { pieces } = makePiecesFromHanzi(ch.hanzi);

  const pieceEls = pieces.map((p) => createPieceElement(p));
  shuffleArray(pieceEls);

  const trayCells = [...tray.querySelectorAll(".cell")];
  trayCells.forEach((c) => (c.innerHTML = ""));

  pieceEls.forEach((pel, i) => {
    if (trayCells[i]) trayCells[i].appendChild(pel);
  });
}

// ✅ FIXED: shuffle no longer deletes tray pieces
function shufflePieces() {
  const tray = document.getElementById("tray");
  const board = document.getElementById("board");

  const trayCells = [...tray.querySelectorAll(".cell")];

  // ✅ collect pieces BEFORE clearing tray
  const trayPieces = [...tray.querySelectorAll(".piece")];
  const unlockedBoardPieces = [...board.querySelectorAll(".piece:not(.locked)")];

  trayCells.forEach((c) => (c.innerHTML = ""));

  const all = [...trayPieces, ...unlockedBoardPieces];
  shuffleArray(all);

  all.forEach((p, i) => {
    if (trayCells[i]) trayCells[i].appendChild(p);
  });

  setStatus("Shuffled ✅");
}

function nextCharacter() {
  state.index++;
  if (state.index >= state.chars.length) {
    setStatus("All characters finished! 🎉 Go back to Levels.", true);
    return;
  }
  renderCharacter();
  startPuzzleForCurrentChar();
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
    btn.textContent = "Music: ON";
    setStatus("Music ON 🎵");
  } else {
    state.music.pause();
    btn.textContent = "Music: OFF";
    setStatus("Music OFF");
  }
}

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

  renderCharacter();
  startPuzzleForCurrentChar();

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
    const ch = state.chars[state.index];
    speakChinese(ch.hanzi || "");
  });

  setupMusic();
});
