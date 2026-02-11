const bookingServices = require("../service/bookingServices")

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingServices.getAllBookings();
        return res.status(200).json({ success: true, bookings: bookings || [] })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching bookings: ${err.message}` })
    }
}

exports.getBookingsByFlat = async (req, res) => {
    try {
        const { flatId } = req.params;
        const bookings = await bookingServices.getBookingsByFlat(flatId);
        return res.status(200).json({ success: true, bookings: bookings || [] })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching bookings for flat: ${err.message}` })
    }
}

exports.addBooking = async (req, res) => {
    try {
        const result = await bookingServices.addBooking(req.body);
        if (result.success) {
            return res.status(201).json(result)
        }
        return res.status(400).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while adding booking: ${err.message}` })
    }
}

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id, isVerified } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "Booking ID is required" });

        const result = await bookingServices.updateBookingStatus(id, isVerified);
        if (result.success) return res.status(200).json(result)
        return res.status(404).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while updating booking: ${err.message}` })
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await bookingServices.rejectBooking(id);
        if (result.success) return res.status(200).json(result)
        return res.status(404).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while rejecting booking: ${err.message}` })
    }
}
