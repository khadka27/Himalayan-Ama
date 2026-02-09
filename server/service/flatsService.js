const Flat = require("../model/Flats");

exports.createFlat = async (flatData, images) => {
    try {
        if (images && images.length > 0) {
            flatData.imagesUri = images;
        }
        const flat = await Flat.create(flatData);
        return { success: true, message: "Flat created successfully", flat };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while creating flat" };
    }
}

exports.getAllFlats = async () => {
    try {
        const flats = await Flat.find({});
        return { success: true, flats };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while fetching flats" };
    }
}

exports.getPublishedFlats = async () => {
    try {
        const flats = await Flat.find({ isActive: true });
        return { success: true, flats };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while fetching published flats" };
    }
}

exports.getFlatById = async (id) => {
    try {
        const flat = await Flat.findById(id);
        if (!flat) return { success: false, message: "Flat not found" };
        return { success: true, flat };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while fetching flat" };
    }
}

exports.updateFlat = async (id, flatData, newImages) => {
    try {
        const existingFlat = await Flat.findById(id);
        if (!existingFlat) return { success: false, message: "Flat not found" };

        if (newImages && newImages.length > 0) {
            // Append new images to existing ones or replace? 
            // Usually for update with files, we might want to append or replace. 
            // Let's assume we append for now, or replace if logic dictates. 
            // But typically a "replace" logic is safer if the user sends the full new list.
            // However, since multer handles upload, we probably get new files.
            // Let's assume we append the new images to the list.
            const currentImages = existingFlat.imagesUri || [];
            flatData.imagesUri = [...currentImages, ...newImages];
        }

        if (flatData.isActive !== undefined) {
            flatData.isActive = flatData.isActive === 'true' || flatData.isActive === true;
        }

        Object.assign(existingFlat, flatData);
        await existingFlat.save();
        return { success: true, message: "Flat updated successfully", flat: existingFlat };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating flat" };
    }
}

exports.deleteFlat = async (id) => {
    try {
        // Soft delete or hard delete?
        // Plan said "Remove a flat (or soft delete by setting isActive to false)".
        // Let's do hard delete for now as per "deleteFlat" name, or we can just use deleteOne.
        await Flat.findByIdAndDelete(id);
        return { success: true, message: "Flat deleted successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while deleting flat" };
    }
}

exports.updateFlatStatus = async (id, status) => {
    try {
        const result = await Flat.updateOne(
            { _id: id },
            { $set: { isActive: status } }
        );
        if (result.modifiedCount === 1) {
            return { success: true, message: "Status updated successfully" };
        } else {
            return { success: false, message: "Status not updated" };
        }
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating flat status" };
    }
}
