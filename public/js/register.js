// public/js/register.js

const regBtn = document.getElementById("reg-btn");

regBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log("Register response:", data);

    // If backend returned an error
    if (!response.ok || data.success === false) {
      alert(data.message || "Server error");
      return;
    }

    alert("Account created! You can now log in.");
    window.location.href = "/login.html";
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error connecting to server");
  }
});
