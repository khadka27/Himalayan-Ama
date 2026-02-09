const Review = require("../model/Reviews")

exports.getAllReviews = () => Review.find({}).populate("flat");

exports.getPublishedReviews = () => Review.find({ isPublished: true }).populate("flat");

exports.addReview = async (reviewData) => {
    try {
        await Review.create(reviewData);
        return { success: true, message: "Review added successfully" };
    } catch (err) {
        console.error("Add Review Error:", err.message);
        return { success: false, message: "Error while adding review" };
    }
}

exports.updateReviewStatus = async (_id, isPublished) => {
    try {
        const result = await Review.updateOne(
            { _id },
            { $set: { isPublished } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: "Status updated" }
        } else {
            return { success: false, message: "Status not updated" }
        }
    } catch (err) {
        console.error("Update Status Error:", err.message);
        return { success: false, message: "Error while updating review status" };
    }
};

exports.deleteReview = async (id) => {
    try {
        const result = await Review.findByIdAndDelete(id);
        if (!result) return { success: false, message: "Review not found" };
        return { success: true, message: "Review deleted successfully" };
    } catch (err) {
        console.error("Delete Review Error:", err.message);
        return { success: false, message: "Error while deleting review" };
    }
}
