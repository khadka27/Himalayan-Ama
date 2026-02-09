const express = require("express");
const router = express.Router();
const reviewController = require("../../controller/reviewController.js");
const authMiddleware = require("../../middleware/checkUser.js")
const upload = require("../../util/multer")

function handleMulter(req, res, next) {
  upload.single("bannerImage")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}

router.get("/getAllReviews", reviewController.getAllReviews);
router.get("/getPublishedReviews", reviewController.getPublishedReviews);
router.get("/getReview", reviewController.getReview);
router.post("/addReview", authMiddleware, handleMulter, reviewController.addReview);
router.put("/updateReview", authMiddleware, handleMulter, reviewController.updateReview);
router.put("/updateReviewStatus", authMiddleware, reviewController.updateReviewStatus);

module.exports = router;