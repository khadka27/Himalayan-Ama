const Review = require("../model/Reviews");
const User = require("../model/Users");
const Author = require("../model/Authors");
const Blog = require("../model/Blogs");

const getStats = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        const activeReviews = await Review.countDocuments({ isActive: true });

        const totalBlogs = await Blog.countDocuments();
        const activeBlogs = await Blog.countDocuments({ isActive: true });

        const totalAuthors = await Author.countDocuments();
        const totalUsers = await User.countDocuments();

        const userAnalytics = await User.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "postedBy",
                    as: "reviews"
                }
            },
            {
                $lookup: {
                    from: "blogs",
                    localField: "_id",
                    foreignField: "postedBy",
                    as: "blogs"
                }
            },
            {
                $project: {
                    userName: 1,
                    email: 1,
                    reviewCount: { $size: "$reviews" },
                    blogCount: { $size: "$blogs" },
                    totalPosts: { $add: [{ $size: "$reviews" }, { $size: "$blogs" }] }
                }
            },
            { $sort: { totalPosts: -1 } }
        ]);

        res.status(200).json({
            totalReviews,
            activeReviews,
            totalBlogs,
            activeBlogs,
            totalAuthors,
            totalUsers,
            userAnalytics
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};

module.exports = {
    getStats
};
