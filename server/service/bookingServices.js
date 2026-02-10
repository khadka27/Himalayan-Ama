const Booking = require("../model/Bookings")

exports.getAllBookings = () => Booking.find({}).populate("flat");
exports.getBookingsByFlat = (flatId) => Booking.find({ flat: flatId });

const { sendOverlapNotification } = require("../util/mail")
const Flat = require("../model/Flats") // Assuming there's a Flats model

exports.addBooking = async (bookingData) => {
    try {
        // Check for overlaps with already verified bookings
        const overlapping = await Booking.findOne({
            flat: bookingData.flat,
            isVerified: true,
            $or: [
                {
                    startDate: { $lt: bookingData.endDate },
                    endDate: { $gt: bookingData.startDate }
                }
            ]
        });

        if (overlapping) {
            // Fetch flat name for the email
            const flat = await Flat.findById(bookingData.flat);
            const flatName = flat ? flat.flatName : "the apartment";

            // Send notification email
            await sendOverlapNotification(
                bookingData.email,
                bookingData.userName,
                flatName,
                new Date(bookingData.startDate).toLocaleDateString(),
                new Date(bookingData.endDate).toLocaleDateString()
            );

            return {
                success: false,
                message: "Selected dates overlap with an existing booking. An email has been sent to you with details."
            };
        }

        await Booking.create(bookingData);
        return { success: true, message: "Booking inquiry sent successfully" };
    } catch (err) {
        console.error("Add Booking Error:", err.message);
        return { success: false, message: "Error while creating booking" };
    }
}

exports.updateBookingStatus = async (_id, isVerified) => {
    try {
        if (isVerified) {
            const currentBooking = await Booking.findById(_id);
            if (!currentBooking) {
                return { success: false, message: "Booking not found" };
            }

            // Check for overlaps with other verified bookings for the same flat
            const overlapping = await Booking.findOne({
                flat: currentBooking.flat,
                isVerified: true,
                _id: { $ne: _id },
                $or: [
                    {
                        startDate: { $lt: currentBooking.endDate },
                        endDate: { $gt: currentBooking.startDate }
                    }
                ]
            });

            if (overlapping) {
                return { success: false, message: "This booking conflicts with another already accepted booking for the same dates." };
            }
        }

        const result = await Booking.updateOne(
            { _id },
            { $set: { isVerified } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: isVerified ? "Booking confirmed" : "Booking unverified" }
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
