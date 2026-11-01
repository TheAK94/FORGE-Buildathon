
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument
} = require("../controllers/documentController");

router.get("/", protect, getDocuments);
router.post("/upload", protect, upload.single("document"), uploadDocument);
router.get("/:id/download", protect, downloadDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;
