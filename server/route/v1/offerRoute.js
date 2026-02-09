const express = require("express");
const router = express.Router();
const offerController = require("../../controller/offerController");
const checkAdmin = require("../../middleware/checkAdmin");

router.get("/", offerController.getAllOffers);
router.get("/active", offerController.getActiveOffers);
router.post("/", checkAdmin, offerController.addOffer);
router.put("/:id", checkAdmin, offerController.updateOffer);
router.delete("/:id", checkAdmin, offerController.deleteOffer);

module.exports = router;
