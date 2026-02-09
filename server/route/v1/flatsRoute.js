const express = require("express");
const router = express.Router();
const flatsController = require("../../controller/flatsController.js");
const authMiddleware = require("../../middleware/checkUser.js");
const upload = require("../../util/multer.js");

// Allow up to 10 images for a flat
const uploadImages = upload.array("images", 10);

function handleMulter(req, res, next) {
    uploadImages(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}

router.post("/create", authMiddleware, handleMulter, flatsController.createFlat);
router.get("/all", flatsController.getAllFlats);
router.get("/published", flatsController.getPublishedFlats);
router.get("/:id", flatsController.getFlatById);
router.put("/update/:id", authMiddleware, handleMulter, flatsController.updateFlat);
router.put("/status/:id", authMiddleware, flatsController.updateFlatStatus);
router.delete("/delete/:id", authMiddleware, flatsController.deleteFlat);

module.exports = router;
