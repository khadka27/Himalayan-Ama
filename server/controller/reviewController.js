const jwt = require("jsonwebtoken");

// services
const reviewServices = require("../service/reviewServices")

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewServices.getAllReviews();
        // Return empty array instead of 404 for admin lists if empty
        return res.status(200).json({ success: true, reviews: reviews || [] })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching all reviews: ${err.message}` })
    }
}

exports.getPublishedReviews = async (req, res) => {
    try {
        const reviews = await reviewServices.getPublishedReviews();
        // Return empty array with 200 OK instead of 404
        return res.status(200).json({ success: true, reviews: reviews || [] })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching published reviews: ${err.message}` })
    }
}

exports.getReview = async (req, res) => {
    try {
        const review = await reviewServices.getReview(req.query.slug);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" })
        }

        return res.status(200).json({ success: true, review })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching review: ${err.message}` })
    }
}

const { exec } = require('child_process');
const path = require('path');

// Helper to manually parse dot notation or bracket notation from multer/FormData
// e.g. "affilatedLink[US]" -> affilatedLink: { US: ... }
const parseNestedBody = (body) => {
    const newBody = { ...body };
    const affiliateMap = {};
    let hasAffiliate = false;

    Object.keys(newBody).forEach(key => {
        if (key.startsWith('affilatedLink[')) {
            // Extract the country code: affilatedLink[US] -> US
            const country = key.match(/affilatedLink\[(.*?)\]/)[1];
            if (country) {
                affiliateMap[country] = newBody[key];
                hasAffiliate = true;
                delete newBody[key]; // cleanup flat key
            }
        }
    });

    if (hasAffiliate) {
        newBody.affilatedLink = affiliateMap;
    }

    return newBody;
};

exports.addReview = async (req, res) => {
    try {
        const banner = req.file
            ? req.file.filename
            : "/default.png";

        const parsedBody = parseNestedBody(req.body);
        parsedBody.postedBy = req.user._id;

        // Parse keyTakeaways if available
        if (parsedBody.keyTakeaways && typeof parsedBody.keyTakeaways === 'string') {
            try {
                parsedBody.keyTakeaways = JSON.parse(parsedBody.keyTakeaways);
            } catch (e) {
                console.error("Error parsing keyTakeaways:", e);
                parsedBody.keyTakeaways = [];
            }
        }

        const result = await reviewServices.addReview(parsedBody, banner);

        if (result.success) {
            // Trigger sitemap generation
            const scriptPath = path.join(__dirname, '../../client/scripts/generate-sitemap.js');
            exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error generating sitemap: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Sitemap generation stderr: ${stderr}`);
                    return;
                }
                console.log(`Sitemap generated: ${stdout}`);
            });

            return res.status(200).json(result || { success: true, message: "Review added" })
        }
        return res.status(404).json(result || { success: false, message: "Review not added" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while adding review: ${err.message}` })
    }
}

exports.updateReview = async (req, res) => {
    try {
        // Only update banner if a file is provided; otherwise, service/model should keep existing
        const banner = req.file ? req.file.filename : undefined;

        const parsedBody = parseNestedBody(req.body);

        // Parse keyTakeaways if available
        if (parsedBody.keyTakeaways && typeof parsedBody.keyTakeaways === 'string') {
            try {
                parsedBody.keyTakeaways = JSON.parse(parsedBody.keyTakeaways);
            } catch (e) {
                console.error("Error parsing keyTakeaways:", e);
                parsedBody.keyTakeaways = [];
            }
        }

        const result = await reviewServices.updateReview(parsedBody, banner);

        if (result.success) return res.status(200).json(result || { success: true, message: "Review updated" })
        return res.status(404).json(result || { success: false, message: "Review not updated" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating review: ${err.message}` })
    }
}

exports.updateReviewStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        const result = await reviewServices.updateReviewStatus(_id, status);

        if (result.success) return res.status(200).json(result || { success: true, message: "Status updated" })
        return res.status(404).json(result || { success: false, message: "Status not updated" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating status: ${err.message}` })
    }
}