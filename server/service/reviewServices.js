const Review = require("../model/Reviews")
const crypto = require("crypto");

const generateShortCode = () => {
    return crypto.randomBytes(4).toString("hex");
};

exports.getAllReviews = () => Review.find({}).populate("author");

exports.getPublishedReviews = () => Review.find({ isActive: true }).populate("author");

exports.getReview = (slug) => Review.findOne({ slug }).populate("author");

exports.addReview = async (review, banner) => {
    try {
        review.bannerImageURI = banner;

        // Generate short link for product
        if (!review.productLink) {
            const shortCode = generateShortCode();
            review.productLink = `/s/${shortCode}`;
        }

        await Review.create(review);
        return { success: true, message: "Review added" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while adding review" };
    }
}

exports.updateReview = async (review, banner) => {
    try {
        const existingReview = await Review.findById(review._id);
        if (!existingReview) return { success: false, message: "Review doesn't exists" };

        if (review.isActive !== undefined) {
            review.isActive = review.isActive === 'true' || review.isActive === true;
        }
        Object.assign(existingReview, review);
        if (banner) existingReview.bannerImageURI = banner;

        // Ensure productLink exists if missing
        if (!existingReview.productLink) {
            const shortCode = generateShortCode();
            existingReview.productLink = `/s/${shortCode}`;
        }

        await existingReview.save();
        return { success: true, message: "Review updated" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating review" };
    }
}

exports.updateReviewStatus = async (_id, status) => {
    try {
        const result = await Review.updateOne(
            { _id },
            { $set: { isActive: status } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: "Status updated" }
        } else {
            return { success: false, message: "Status not updated" }
        }
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating review status" };
    }
};
