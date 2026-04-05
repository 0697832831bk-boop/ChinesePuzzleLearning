const express = require("express");
const router = express.Router();
const Character = require("../models/Character");

// GET /api/characters?hsk=1
// GET /api/characters?level=1
router.get("/", async (req, res) => {
  try {
    const queryValue = req.query.hsk || req.query.level;

    if (!queryValue) {
      return res.status(400).json({
        success: false,
        message: "Missing query parameter: hsk or level",
      });
    }

    const level = parseInt(queryValue, 10);

    if (isNaN(level)) {
      return res.status(400).json({
        success: false,
        message: "HSK level must be a number",
      });
    }

    const characters = await Character.find({ hsk: level }).lean();

    return res.json({
      success: true,
      characters,
    });
  } catch (err) {
    console.error("Characters API error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;