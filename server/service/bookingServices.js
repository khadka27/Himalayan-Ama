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

        await Booking.create({ ...bookingData, status: "pending" });
        return { success: true, message: "Booking inquiry sent successfully" };
    } catch (err) {
        console.error("Add Booking Error:", err.message);
        return { success: false, message: "Error while creating booking" };
    }
}

exports.updateBookingStatus = async (_id, isVerified) => {
    try {
        const currentBooking = await Booking.findById(_id);
        if (!currentBooking) {
            return { success: false, message: "Booking not found" };
        }

        if (isVerified) {
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
                // Update status to overlap
                await Booking.updateOne(
                    { _id },
                    { $set: { status: "overlap", isVerified: false } }
                );

                // Fetch flat name for the email
                const flat = await Flat.findById(currentBooking.flat);
                const flatName = flat ? flat.flatName : "the apartment";

                // Send notification email
                await sendOverlapNotification(
                    currentBooking.email,
                    currentBooking.userName,
                    flatName,
                    new Date(currentBooking.startDate).toLocaleDateString(),
                    new Date(currentBooking.endDate).toLocaleDateString()
                );

                return {
                    success: true,
                    message: "Booking dates overlap with an existing confirmed booking. Status changed to 'overlap' and user notified.",
                    status: "overlap"
                };
            }
        }

        const newStatus = isVerified ? "confirmed" : "pending";
        const result = await Booking.updateOne(
            { _id },
            { $set: { isVerified, status: newStatus } }
        );

        if (result.matchedCount === 1) {
            return {
                success: true,
                message: isVerified ? "Booking confirmed" : "Booking moved to pending",
                status: newStatus
            }
        } else {
            return { success: false, message: "Booking status not updated" }
        }
    } catch (err) {
        console.error("Update Booking Status Error:", err.message);
        return { success: false, message: `Error while updating booking status: ${err.message}` };
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
