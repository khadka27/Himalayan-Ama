const express = require("express");
const router = express.Router();
const reviewController = require("../../controller/reviewController.js");
const authMiddleware = require("../../middleware/checkUser.js")

// Public routes
router.get("/publishable", reviewController.getPublishedReviews);
router.post("/", reviewController.addReview);

// Admin routes (Protected)
router.get("/", authMiddleware, reviewController.getAllReviews);
router.patch("/status", authMiddleware, reviewController.updateReviewStatus);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;