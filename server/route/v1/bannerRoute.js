const express = require("express");
const router = express.Router();
const bannerController = require("../../controller/bannerController");
const checkAdmin = require("../../middleware/checkAdmin");

router.get("/", bannerController.getBanner);
router.post("/", checkAdmin, bannerController.updateBanner);

module.exports = router;
