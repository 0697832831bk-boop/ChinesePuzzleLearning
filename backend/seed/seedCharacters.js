// backend/seed/seedCharacters.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Character = require("../models/Character");

const data = [
  // HSK 1 (add more later)
  { hsk: 1, hanzi: "你", pinyin: "nǐ", meaning: "you" },
  { hsk: 1, hanzi: "我", pinyin: "wǒ", meaning: "I / me" },
  { hsk: 1, hanzi: "他", pinyin: "tā", meaning: "he / him" },
  { hsk: 1, hanzi: "好", pinyin: "hǎo", meaning: "good" },
  { hsk: 1, hanzi: "是", pinyin: "shì", meaning: "to be" },

  // HSK 2
  { hsk: 2, hanzi: "因为", pinyin: "yīnwèi", meaning: "because" },
  { hsk: 2, hanzi: "所以", pinyin: "suǒyǐ", meaning: "therefore" },
  { hsk: 2, hanzi: "觉得", pinyin: "juéde", meaning: "to feel / think" },
  { hsk: 2, hanzi: "可能", pinyin: "kěnéng", meaning: "maybe / possible" },
  { hsk: 2, hanzi: "已经", pinyin: "yǐjīng", meaning: "already" },

  // HSK 3
  { hsk: 3, hanzi: "经验", pinyin: "jīngyàn", meaning: "experience" },
  { hsk: 3, hanzi: "帮助", pinyin: "bāngzhù", meaning: "help" },
  { hsk: 3, hanzi: "应该", pinyin: "yīnggāi", meaning: "should" },
  { hsk: 3, hanzi: "发现", pinyin: "fāxiàn", meaning: "discover" },
  { hsk: 3, hanzi: "提高", pinyin: "tígāo", meaning: "improve" },

  // HSK 4
  { hsk: 4, hanzi: "安排", pinyin: "ānpái", meaning: "arrange" },
  { hsk: 4, hanzi: "保证", pinyin: "bǎozhèng", meaning: "guarantee" },
  { hsk: 4, hanzi: "理解", pinyin: "lǐjiě", meaning: "understand" },
  { hsk: 4, hanzi: "发展", pinyin: "fāzhǎn", meaning: "develop" },
  { hsk: 4, hanzi: "情况", pinyin: "qíngkuàng", meaning: "situation" },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected ✓");

  // clean old data (optional)
  await Character.deleteMany({});
  await Character.insertMany(data);

  console.log(`Seeded ${data.length} characters ✓`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
