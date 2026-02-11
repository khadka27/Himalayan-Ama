const Review = require("../model/Reviews");
const User = require("../model/Users");
const Blog = require("../model/Blogs");
const Service = require("../model/Services");
const Booking = require("../model/Bookings");
const Flat = require("../model/Flats");
const Host = require("../model/Hosts");

const getStats = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        const activeReviews = await Review.countDocuments({ isPublished: true });
        const positiveReviews = await Review.countDocuments({ rating: { $gte: 4 } });
        const negativeReviews = await Review.countDocuments({ rating: { $lt: 4 } });

        const totalBlogs = await Blog.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalHosts = await Host.countDocuments();

        // Inquiries - Placeholder until Inquiry model exists
        const totalInquiries = 0;

        // Monthly Revenue Calculation
        const bookings = await Booking.find().populate('flat');
        const monthlyRevenueMap = new Map();

        bookings.forEach(booking => {
            if (booking.flat && booking.startDate && booking.endDate) {
                const month = new Date(booking.startDate).getMonth(); // 0-11
                const duration = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)));
                const revenue = (booking.flat.price || 0) * duration;

                const currentRevenue = monthlyRevenueMap.get(month) || 0;
                monthlyRevenueMap.set(month, currentRevenue + revenue);
            }
        });

        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
            month: i,
            total_revenue: monthlyRevenueMap.get(i) || 0
        }));

        res.status(200).json({
            status: true,
            data: {
                total_blogs: totalBlogs,
                total_services: totalServices,
                total_inquiries: totalInquiries,
                total_bookings: totalBookings,
                monthly_revenue: monthlyRevenue,
                positive_reviews: positiveReviews,
                negative_reviews: negativeReviews,
                // Keep original fields for backward compatibility if needed
                totalReviews,
                activeReviews,
                totalUsers,
                total_hosts: totalHosts
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ status: false, message: "Error fetching stats", error: error.message });
    }
};

module.exports = {
    getStats
};
