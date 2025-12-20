// backend/models/Character.js
const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema(
  {
    hsk: { type: Number, required: true, index: true },      // 1,2,3,4...
    hanzi: { type: String, required: true },                 // 汉字
    pinyin: { type: String, required: true },                // pin yin
    meaning: { type: String, required: true },               // English meaning
  },
  { timestamps: true }
);

module.exports = mongoose.model("Character", CharacterSchema);
