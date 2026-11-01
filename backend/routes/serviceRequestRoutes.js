const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRequest,
  getRequests,
  getRequestById
} = require("../controllers/serviceRequestController");

router.use(protect);

router.get("/", getRequests);
router.post("/", createRequest);
router.get("/:id", getRequestById);

module.exports = router;