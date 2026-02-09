const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController.js");
const checkAdmin = require("../../middleware/checkAdmin.js");

// All user management routes require super admin privileges
router.get("/", checkAdmin, userController.getAllUsers);
router.post("/", checkAdmin, userController.addUser);
router.patch("/status", checkAdmin, userController.updateUserStatus);
router.delete("/:id", checkAdmin, userController.deleteUser);

// Keeping old ones for compatibility if needed elsewhere, but cleaning up main ones
router.get("/getUser", checkAdmin, userController.getUser);
router.put("/updateUser", checkAdmin, userController.updateUser);

module.exports = router;
