const express = require("express");
const router = express.Router();
const  userController = require("../controller/userController.js");
const {isAdmin} = require("../middleware/isAdmin");

router.get("/getUserDetails", userController.getUserDetails);
router.get("/getRemoteUserDetails", userController.getRemoteUserDetails);
router.get("/getAllUserDetails", isAdmin, userController.getAllUserDetails);
router.post("/updateUserDepartment", isAdmin, userController.updateUserDepartment);
router.post("/updateUserPosition", isAdmin, userController.updateUserPosition);
router.post("/updateTimeEntries", isAdmin, userController.updateTimeEntries);

module.exports = router;
