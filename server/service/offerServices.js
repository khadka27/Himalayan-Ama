const ServiceOffer = require("../model/ServiceOffer");

exports.getAllOffers = async () => {
    try {
        const offers = await ServiceOffer.find().populate("flat");
        return { success: true, offers };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.getActiveOffers = async () => {
    try {
        const now = new Date();
        const offers = await ServiceOffer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).populate("flat");
        return { success: true, offers };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.addOffer = async (offerData) => {
    try {
        const offer = await ServiceOffer.create(offerData);
        return { success: true, message: "Offer created", offer };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.updateOffer = async (id, offerData) => {
    try {
        const offer = await ServiceOffer.findByIdAndUpdate(id, { $set: offerData }, { new: true, runValidators: true });
        if (!offer) return { success: false, message: "Offer not found" };
        return { success: true, message: "Offer updated", offer };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.deleteOffer = async (id) => {
    try {
        const offer = await ServiceOffer.findByIdAndDelete(id);
        if (!offer) return { success: false, message: "Offer not found" };
        return { success: true, message: "Offer deleted" };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
