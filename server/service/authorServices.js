const Author = require("../model/Authors");

exports.getAllAuthors = () => Author.find({});

exports.getAuthor = (id) => Author.findById(id);

exports.addAuthor = async (authorData, imagePath) => {
    try {
        authorData.authorImage = imagePath;
        await Author.create(authorData);
        return { success: true, message: "Author added successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while adding author" };
    }
}

exports.updateAuthor = async (authorData, imagePath) => {
    try {
        const existingAuthor = await Author.findById(authorData._id);
        if (!existingAuthor) return { success: false, message: "Author doesn't exist" };

        Object.assign(existingAuthor, authorData);
        if (imagePath) existingAuthor.authorImage = imagePath;

        await existingAuthor.save();
        return { success: true, message: "Author updated successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating author" };
    }
}