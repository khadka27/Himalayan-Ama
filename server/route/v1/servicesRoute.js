const express = require("express");
const router = express.Router();
const servicesController = require("../../controller/servicesController");
const authMiddleware = require("../../middleware/checkUser");
const upload = require("../../util/multer");

const uploadImage = upload.single("image");

function handleMulter(req, res, next) {
    uploadImage(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}

router.post("/create", authMiddleware, handleMulter, servicesController.createService);
router.get("/all", servicesController.getAllServices);
router.get("/active", servicesController.getActiveServices);
router.get("/:id", servicesController.getServiceById);
router.put("/update/:id", authMiddleware, handleMulter, servicesController.updateService);
router.delete("/delete/:id", authMiddleware, servicesController.deleteService);

module.exports = router;
