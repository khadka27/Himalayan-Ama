const express = require("express");
const router = express.Router();
const authorController = require("../../controller/authorController.js");
const authMiddleware = require("../../middleware/checkUser.js")
const upload = require("../../util/multer")

router.get("/getAllAuthors", authorController.getAllAuthor);
router.get("/getAuthor", authorController.getAuthor);
router.post("/addAuthor", authMiddleware, upload.single("authorImage"), authorController.addAuthor);
router.post("/updateAuthor", authMiddleware, upload.single("authorImage"), authorController.updateAuthor);

module.exports = router;