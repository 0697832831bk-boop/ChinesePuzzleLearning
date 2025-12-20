const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// 🔹 NEW: log every request (so we see POST /api/auth/register)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===== Routes =====
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const charactersRoutes = require("./routes/characters");
app.use("/api/characters", charactersRoutes);



// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✓"))
  .catch((err) => console.error("MongoDB Error ❌", err));

// 🔹 NEW: global error handler (catches thrown errors)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});
