const express = require("express");
const router = express.Router();
const hostController = require("../../controller/hostController.js");
const authMiddleware = require("../../middleware/checkUser.js");
const upload = require("../../util/multer");

function handleMulter(req, res, next) {
    upload.single("hostImage")(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}

router.get("/getAllHosts", hostController.getAllHosts);
router.get("/getActiveHosts", hostController.getActiveHosts);
router.get("/getHost/:id", hostController.getHost);
router.post("/addHost", authMiddleware, handleMulter, hostController.addHost);
router.put("/updateHost", authMiddleware, handleMulter, hostController.updateHost);
router.put("/updateHostStatus", authMiddleware, hostController.updateHostStatus);
router.delete("/deleteHost/:id", authMiddleware, hostController.deleteHost);

module.exports = router;
