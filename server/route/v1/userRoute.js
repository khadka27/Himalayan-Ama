const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController.js");
const checkAdmin = require("../../middleware/checkAdmin.js");

// All user management routes require super admin privileges
router.get("/getAllUsers", checkAdmin, userController.getAllUsers);
router.get("/getUser", checkAdmin, userController.getUser);
router.post("/addUser", checkAdmin, userController.addUser);
router.put("/updateUser", checkAdmin, userController.updateUser);
router.delete("/deleteUser", checkAdmin, userController.deleteUser);
router.put("/updateUserStatus", checkAdmin, userController.updateUserStatus);

module.exports = router;
