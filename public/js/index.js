// Protect index page (must be logged in)
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}

// Update username label if present
const userNameEl = document.getElementById("user-name");
if (userNameEl) {
  userNameEl.textContent = `User: ${user.username || "Learner"}`;
}
