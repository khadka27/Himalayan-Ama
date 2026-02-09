const reviewServices = require("../service/reviewServices")

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewServices.getAllReviews();
        return res.status(200).json({ success: true, reviews: reviews || [] })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching reviews: ${err.message}` })
    }
}

exports.getPublishedReviews = async (req, res) => {
    try {
        const reviews = await reviewServices.getPublishedReviews();
        return res.status(200).json({ success: true, reviews: reviews || [] })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching reviews: ${err.message}` })
    }
}

exports.addReview = async (req, res) => {
    try {
        // Validation could be added here
        const result = await reviewServices.addReview(req.body);
        if (result.success) {
            return res.status(201).json(result)
        }
        return res.status(400).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while adding review: ${err.message}` })
    }
}

exports.updateReviewStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "Review ID is required" });

        const result = await reviewServices.updateReviewStatus(id, status);
        if (result.success) return res.status(200).json(result)
        return res.status(404).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while updating status: ${err.message}` })
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reviewServices.deleteReview(id);
        if (result.success) return res.status(200).json(result)
        return res.status(404).json(result)
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: `Error while deleting review: ${err.message}` })
    }
}