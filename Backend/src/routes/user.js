const express = require("express");
const { authenticate } = require("../controllers/user");
const {
  saveDoc,
  getAllDocuments,
  getDocument,
} = require("../controllers/document");

const router = express.Router();

router.post("/", authenticate);
router.post("/save/:id", saveDoc);
router.get("/docs/:id", getAllDocuments);
router.get("/:id", getDocument);

module.exports = router;
