const blogServices = require("../service/blogServices")
const path = require('path');
const { exec } = require('child_process');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogServices.getAllBlogs();
        return res.status(200).json({ success: true, blogs: blogs || [] })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching all blogs: ${err.message}` })
    }
}

exports.getPublishedBlogs = async (req, res) => {
    try {
        const blogs = await blogServices.getPublishedBlogs();
        return res.status(200).json({ success: true, blogs: blogs || [] })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching published blogs: ${err.message}` })
    }
}

exports.getBlog = async (req, res) => {
    try {
        const blog = await blogServices.getBlog(req.query.slug);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })
        }

        return res.status(200).json({ success: true, blog })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching blog: ${err.message}` })
    }
}

exports.addBlog = async (req, res) => {
    try {
        const banner = req.file
            ? req.file.filename
            : "/default.png";

        // Parse keyTakeaways if it's a string (sent as JSON from client)
        if (req.body.keyTakeaways && typeof req.body.keyTakeaways === 'string') {
            try {
                req.body.keyTakeaways = JSON.parse(req.body.keyTakeaways);
            } catch (e) {
                console.error("Error parsing keyTakeaways:", e);
                req.body.keyTakeaways = [];
            }
        }

        const blogData = {
            ...req.body,
            postedBy: req.user._id,
            isActive: (req.body.isActive === "true" || req.body.isActive === true) || (req.body.is_active === "true" || req.body.is_active === true)
        };
        const result = await blogServices.addBlog(blogData, banner);

        if (result.success) {
            // Trigger sitemap generation (assuming same script works or needs update - keeping it for now)
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

            return res.status(200).json(result || { success: true, message: "Blog added" })
        }
        return res.status(404).json(result || { success: false, message: "Blog not added" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while adding blog: ${err.message}` })
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const banner = req.file ? req.file.filename : undefined;

        // Parse keyTakeaways if it's a string (sent as JSON from client)
        if (req.body.keyTakeaways && typeof req.body.keyTakeaways === 'string') {
            try {
                req.body.keyTakeaways = JSON.parse(req.body.keyTakeaways);
            } catch (e) {
                console.error("Error parsing keyTakeaways:", e);
                req.body.keyTakeaways = [];
            }
        }

        const result = await blogServices.updateBlog(req.body, banner);

        if (result.success) return res.status(200).json(result || { success: true, message: "Blog updated" })
        return res.status(404).json(result || { success: false, message: "Blog not updated" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating blog: ${err.message}` })
    }
}

exports.updateBlogStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        const result = await blogServices.updateBlogStatus(_id, status);

        if (result.success) return res.status(200).json(result || { success: true, message: "Status updated" })
        return res.status(404).json(result || { success: false, message: "Status not updated" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating status: ${err.message}` })
    }
}
