const Booking = require("../model/Bookings")

exports.getAllBookings = () => Booking.find({}).populate("flat");

exports.addBooking = async (bookingData) => {
    try {
        await Booking.create(bookingData);
        return { success: true, message: "Booking inquiry sent successfully" };
    } catch (err) {
        console.error("Add Booking Error:", err.message);
        return { success: false, message: "Error while creating booking" };
    }
}

exports.updateBookingStatus = async (_id, isVerified) => {
    try {
        const result = await Booking.updateOne(
            { _id },
            { $set: { isVerified } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: "Booking confirmed" }
        } else {
            return { success: false, message: "Booking status not updated" }
        }
    } catch (err) {
        console.error("Update Booking Status Error:", err.message);
        return { success: false, message: "Error while updating booking status" };
    }
};

exports.deleteBooking = async (id) => {
    try {
        const result = await Booking.findByIdAndDelete(id);
        if (!result) return { success: false, message: "Booking not found" };
        return { success: true, message: "Booking deleted successfully" };
    } catch (err) {
        console.error("Delete Booking Error:", err.message);
        return { success: false, message: "Error while deleting booking" };
    }
}
