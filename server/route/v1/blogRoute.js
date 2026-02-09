const express = require("express");
const router = express.Router();
const blogController = require("../../controller/blogController.js");
const authMiddleware = require("../../middleware/checkUser.js")
const upload = require("../../util/multer")

function handleMulter(req, res, next) {
    upload.single("bannerImage")(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}

router.get("/getAllBlogs", blogController.getAllBlogs);
router.get("/getPublishedBlogs", blogController.getPublishedBlogs);
router.get("/getBlog", blogController.getBlog);
router.post("/addBlog", authMiddleware, handleMulter, blogController.addBlog);
router.put("/updateBlog", authMiddleware, handleMulter, blogController.updateBlog);
router.put("/updateBlogStatus", authMiddleware, blogController.updateBlogStatus);

module.exports = router;
