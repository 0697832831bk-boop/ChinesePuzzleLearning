// backend/seed/seedCharacters.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Character = require("../models/Character");

const data = [
  // HSK 1
  { hsk: 1, hanzi: "你", pinyin: "nǐ", meaning: "you" },
  { hsk: 1, hanzi: "我", pinyin: "wǒ", meaning: "I / me" },
  { hsk: 1, hanzi: "他", pinyin: "tā", meaning: "he / him" },
  { hsk: 1, hanzi: "她", pinyin: "tā", meaning: "she / her" },
  { hsk: 1, hanzi: "好", pinyin: "hǎo", meaning: "good" },
  { hsk: 1, hanzi: "是", pinyin: "shì", meaning: "to be" },
  { hsk: 1, hanzi: "不", pinyin: "bù", meaning: "not" },
  { hsk: 1, hanzi: "了", pinyin: "le", meaning: "completed action marker" },
  { hsk: 1, hanzi: "人", pinyin: "rén", meaning: "person" },
  { hsk: 1, hanzi: "在", pinyin: "zài", meaning: "at / in" },
  { hsk: 1, hanzi: "有", pinyin: "yǒu", meaning: "to have" },
  { hsk: 1, hanzi: "这", pinyin: "zhè", meaning: "this" },
  { hsk: 1, hanzi: "那", pinyin: "nà", meaning: "that" },
  { hsk: 1, hanzi: "中", pinyin: "zhōng", meaning: "middle / China" },
  { hsk: 1, hanzi: "大", pinyin: "dà", meaning: "big" },
  { hsk: 1, hanzi: "小", pinyin: "xiǎo", meaning: "small" },
  { hsk: 1, hanzi: "上", pinyin: "shàng", meaning: "up / on" },
  { hsk: 1, hanzi: "下", pinyin: "xià", meaning: "down / below" },
  { hsk: 1, hanzi: "来", pinyin: "lái", meaning: "come" },
  { hsk: 1, hanzi: "去", pinyin: "qù", meaning: "go" },
  { hsk: 1, hanzi: "看", pinyin: "kàn", meaning: "look / see" },
  { hsk: 1, hanzi: "听", pinyin: "tīng", meaning: "listen" },
  { hsk: 1, hanzi: "吃", pinyin: "chī", meaning: "eat" },
  { hsk: 1, hanzi: "喝", pinyin: "hē", meaning: "drink" },

  // HSK 2
  { hsk: 2, hanzi: "学", pinyin: "xué", meaning: "study / learn" },
  { hsk: 2, hanzi: "习", pinyin: "xí", meaning: "practice" },
  { hsk: 2, hanzi: "问", pinyin: "wèn", meaning: "ask" },
  { hsk: 2, hanzi: "题", pinyin: "tí", meaning: "question / topic" },
  { hsk: 2, hanzi: "前", pinyin: "qián", meaning: "front / before" },
  { hsk: 2, hanzi: "后", pinyin: "hòu", meaning: "back / after" },
  { hsk: 2, hanzi: "左", pinyin: "zuǒ", meaning: "left" },
  { hsk: 2, hanzi: "右", pinyin: "yòu", meaning: "right" },
  { hsk: 2, hanzi: "钱", pinyin: "qián", meaning: "money" },
  { hsk: 2, hanzi: "店", pinyin: "diàn", meaning: "shop / store" },
  { hsk: 2, hanzi: "买", pinyin: "mǎi", meaning: "buy" },
  { hsk: 2, hanzi: "卖", pinyin: "mài", meaning: "sell" },
  { hsk: 2, hanzi: "路", pinyin: "lù", meaning: "road" },
  { hsk: 2, hanzi: "车", pinyin: "chē", meaning: "car / vehicle" },
  { hsk: 2, hanzi: "医", pinyin: "yī", meaning: "medical / doctor" },
  { hsk: 2, hanzi: "院", pinyin: "yuàn", meaning: "institute / courtyard" },
  { hsk: 2, hanzi: "找", pinyin: "zhǎo", meaning: "find" },
  { hsk: 2, hanzi: "件", pinyin: "jiàn", meaning: "item / piece" },
  { hsk: 2, hanzi: "再", pinyin: "zài", meaning: "again" },
  { hsk: 2, hanzi: "真", pinyin: "zhēn", meaning: "real / really" },
  { hsk: 2, hanzi: "最", pinyin: "zuì", meaning: "most" },
  { hsk: 2, hanzi: "能", pinyin: "néng", meaning: "can / be able to" },

  // HSK 3
  { hsk: 3, hanzi: "帮", pinyin: "bāng", meaning: "help" },
  { hsk: 3, hanzi: "助", pinyin: "zhù", meaning: "assist" },
  { hsk: 3, hanzi: "教", pinyin: "jiào", meaning: "teach" },
  { hsk: 3, hanzi: "希", pinyin: "xī", meaning: "hope" },
  { hsk: 3, hanzi: "望", pinyin: "wàng", meaning: "hope / expect" },
  { hsk: 3, hanzi: "世", pinyin: "shì", meaning: "world" },
  { hsk: 3, hanzi: "界", pinyin: "jiè", meaning: "boundary / world" },
  { hsk: 3, hanzi: "发", pinyin: "fā", meaning: "send / develop" },
  { hsk: 3, hanzi: "现", pinyin: "xiàn", meaning: "appear / present" },
  { hsk: 3, hanzi: "提", pinyin: "tí", meaning: "raise / lift" },
  { hsk: 3, hanzi: "高", pinyin: "gāo", meaning: "high / tall" },
  { hsk: 3, hanzi: "验", pinyin: "yàn", meaning: "test / examine" },

  // HSK 4
  { hsk: 4, hanzi: "安", pinyin: "ān", meaning: "peace / safe" },
  { hsk: 4, hanzi: "排", pinyin: "pái", meaning: "line up / arrange" },
  { hsk: 4, hanzi: "保", pinyin: "bǎo", meaning: "protect / guarantee" },
  { hsk: 4, hanzi: "证", pinyin: "zhèng", meaning: "proof / certificate" },
  { hsk: 4, hanzi: "理", pinyin: "lǐ", meaning: "reason / manage" },
  { hsk: 4, hanzi: "解", pinyin: "jiě", meaning: "explain / understand" },
  { hsk: 4, hanzi: "况", pinyin: "kuàng", meaning: "condition / situation" },
  { hsk: 4, hanzi: "需", pinyin: "xū", meaning: "need" },
  { hsk: 4, hanzi: "感", pinyin: "gǎn", meaning: "feel / sense" },
  { hsk: 4, hanzi: "质", pinyin: "zhì", meaning: "quality / nature" },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  await Character.deleteMany({});
  await Character.insertMany(data);

  console.log(`Seeded ${data.length} characters`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
