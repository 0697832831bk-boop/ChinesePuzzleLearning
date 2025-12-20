// backend/routes/characters.js
const express = require("express");
const router = express.Router();
const Character = require("../models/Character");

// GET /api/characters?hsk=1   OR  /api/characters?level=1
router.get("/", async (req, res) => {
  try {
    const q = req.query.hsk || req.query.level;
    const level = parseInt(q, 10);

    if (!level) {
      return res.status(400).json({
        success: false,
        message: "Missing query param: hsk or level",
      });
    }

    const characters = await Character.find({ hsk: level }).lean();
    return res.json({ success: true, characters });
  } catch (err) {
    console.error("Characters API error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
