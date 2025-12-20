// Protect page – require login (use user, not token)
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}

// show username
document.getElementById("user-name").innerText = `👤 ${user.username || "Learner"}`;

// go to puzzle page with selected level
document.querySelectorAll("[data-level]").forEach((card) => {
  card.addEventListener("click", () => {
    const level = card.dataset.level;
    window.location.href = `game.html?level=${level}`;
  });
});

