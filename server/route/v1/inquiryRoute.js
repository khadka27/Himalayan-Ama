const express = require("express");
const router = express.Router();
const inquiryController = require("../../controller/inquiryController.js");
const authMiddleware = require("../../middleware/checkUser.js");

// Public routes
router.post("/", inquiryController.createInquiry);

// Admin routes (Protected)
router.get("/", authMiddleware, inquiryController.getAllInquiries);

module.exports = router;
