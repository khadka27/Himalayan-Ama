const express = require("express");
const router = express.Router();
const bookingController = require("../../controller/bookingController.js");
const authMiddleware = require("../../middleware/checkUser.js")

// Public route to book
router.post("/", bookingController.addBooking);
router.get("/flat/:flatId", bookingController.getBookingsByFlat);

// Admin routes
router.get("/", authMiddleware, bookingController.getAllBookings);
router.patch("/status", authMiddleware, bookingController.updateBookingStatus);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

module.exports = router;
