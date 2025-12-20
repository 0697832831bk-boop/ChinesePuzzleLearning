// ✅ Protect index page (must be logged in)
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

// ✅ If you have an element to show username, use it
const userLabel = document.getElementById("user-label");
if (userLabel) userLabel.textContent = user.username;
