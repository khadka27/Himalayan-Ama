const authorServices = require("../service/authorServices");

exports.getAllAuthor = async (req, res) => {
    try {
        const authors = await authorServices.getAllAuthors();
        if (authors.length === 0) {
            return res.status(404).json({ success: false, message: "No authors found" });
        }
        return res.status(200).json({ success: true, authors });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching authors: ${err.message}` });
    }
}

exports.getAuthor = async (req, res) => {
    try {
        const author = await authorServices.getAuthor(req.query.id);
        if (!author) {
            return res.status(404).json({ success: false, message: "Author not found" });
        }
        return res.status(200).json({ success: true, author });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching author: ${err.message}` });
    }
}

exports.addAuthor = async (req, res) => {
    try {
        const authorImage = req.file
            ? req.file.filename
            : "/default.png";

        const result = await authorServices.addAuthor(req.body, authorImage);

        if (result.success) return res.status(200).json(result || { success: true, message: "Author added" });
        return res.status(404).json(result || { success: false, message: "Author not added" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while adding author: ${err.message}` });
    }
}

exports.updateAuthor = async (req, res) => {
    try {
        const authorImage = req.file
            ? req.file.filename
            : null;

        const result = await authorServices.updateAuthor(req.body, authorImage);

        if (result.success) return res.status(200).json(result || { success: true, message: "Author updated" });
        return res.status(404).json(result || { success: false, message: "Author not updated" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating author: ${err.message}` });
    }
}