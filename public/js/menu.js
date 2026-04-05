// Protect page: require login
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}

// Show username
const userNameEl = document.getElementById("user-name");
if (userNameEl) {
  userNameEl.textContent = `User: ${user.username || "Learner"}`;
}

// Go to level selection page with selected level
document.querySelectorAll("[data-level]").forEach((card) => {
  card.addEventListener("click", () => {
    const level = card.dataset.level;
    window.location.href = `game.html?level=${level}`;
  });
});
