const Blog = require("../model/Blogs")

exports.getAllBlogs = () => Blog.find({});

exports.getPublishedBlogs = () => Blog.find({ isActive: true });

exports.getBlog = (slug) => Blog.findOne({ slug });

exports.addBlog = async (blog, banner) => {
    try {
        blog.bannerImageURI = banner;

        await Blog.create(blog);
        return { success: true, message: "Blog added" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while adding blog" };
    }
}

exports.updateBlog = async (blog, banner) => {
    try {
        const existingBlog = await Blog.findById(blog._id);
        if (!existingBlog) return { success: false, message: "Blog doesn't exist" };

        if (blog.isActive !== undefined) {
            blog.isActive = blog.isActive === 'true' || blog.isActive === true;
        }
        Object.assign(existingBlog, blog);
        if (banner) existingBlog.bannerImageURI = banner;

        await existingBlog.save();
        return { success: true, message: "Blog updated" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating blog" };
    }
}

exports.updateBlogStatus = async (_id, status) => {
    try {
        const result = await Blog.updateOne(
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
        return { success: false, message: "Error while updating blog status" };
    }
};
