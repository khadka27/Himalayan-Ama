const express = require("express");
const router = express.Router();
const authContoller = require("../controller/authController.js");

router.post("/login", authContoller.login);
// router.get("/logout", authContoller.logout);
// router.get("/checkToken", authContoller.checkToken);

module.exports = router;