// public/js/game.js

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

async function loadLevel(hsk) {
  const charsDiv = document.getElementById("chars");
  charsDiv.textContent = "Loading characters...";

  try {
    const res = await fetch(`/api/characters?hsk=${hsk}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      charsDiv.textContent = data.message || "Failed to load characters";
      return;
    }

    if (!data.characters || data.characters.length === 0) {
      charsDiv.textContent = `No characters found for HSK ${hsk}. Run the seed script first.`;
      return;
    }

    // ✅ Save for jigsaw page
    localStorage.setItem("hskLevel", String(hsk));
    localStorage.setItem("characters", JSON.stringify(data.characters));
    localStorage.setItem("charIndex", "0");

    // ✅ Go to JIGSAW game
    window.location.href = "jigsaw.html";

  } catch (err) {
    console.error("Load characters error:", err);
    charsDiv.textContent = "Failed to load characters. Check backend console.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Welcome text
  document.getElementById("welcome").textContent = `Welcome, ${user.username}!`;

  // HSK buttons
  document.querySelectorAll("button[data-hsk]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hsk = Number(btn.dataset.hsk);
      loadLevel(hsk);
    });
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("characters");
    localStorage.removeItem("hskLevel");
    localStorage.removeItem("charIndex");
    window.location.href = "login.html";
  });
});
