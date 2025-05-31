const express = require("express");
const {
  reWriteAI,
  summarizeAI,
  shortenAI,
  expandAI,
} = require("../controllers/aiGeneration");

const router = express.Router();

router.post("/rewrite", reWriteAI);
router.post("/shorten", shortenAI);
router.post("/expand", expandAI);
router.post("/summarize", summarizeAI);

module.exports = router;
