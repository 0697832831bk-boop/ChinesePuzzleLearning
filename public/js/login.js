document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ THIS IS THE PART YOU ASKED ABOUT
    localStorage.setItem("user", JSON.stringify({
      username: data.username,
      email: data.email
    }));

    alert("Login successful!");
    window.location.href = "game.html";

  } catch (err) {
    console.error("Login error:", err);
    alert("Error connecting to server");
  }
});
