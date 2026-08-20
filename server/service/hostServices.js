const Host = require("../model/Hosts");

exports.getAllHosts = () => Host.find({});

exports.getActiveHosts = () => Host.find({ isActive: true });

exports.getHostById = (id) => Host.findById(id);

exports.addHost = async (hostData, imageUri) => {
    try {
        if (imageUri) hostData.imageUri = imageUri;
        
        if (typeof hostData.bioParagraphs === "string") {
            try {
                hostData.bioParagraphs = JSON.parse(hostData.bioParagraphs);
            } catch (e) {
                hostData.bioParagraphs = hostData.bioParagraphs.split("\n").filter(Boolean);
            }
        }
        if (typeof hostData.languages === "string") {
            try {
                hostData.languages = JSON.parse(hostData.languages);
            } catch (e) {
                hostData.languages = hostData.languages.split(",").map(l => l.trim()).filter(Boolean);
            }
        }

        await Host.create(hostData);
        return { success: true, message: "Host added successfully" };
    } catch (err) {
        console.error("Error adding host:", err.message);
        return { success: false, message: "Error while adding host" };
    }
};

exports.updateHost = async (hostData, imageUri) => {
    try {
        const existingHost = await Host.findById(hostData._id);
        if (!existingHost) return { success: false, message: "Host not found" };

        if (hostData.isActive !== undefined) {
            hostData.isActive = hostData.isActive === 'true' || hostData.isActive === true;
        }

        if (typeof hostData.bioParagraphs === "string") {
            try {
                hostData.bioParagraphs = JSON.parse(hostData.bioParagraphs);
            } catch (e) {
                hostData.bioParagraphs = hostData.bioParagraphs.split("\n").filter(Boolean);
            }
        }
        if (typeof hostData.languages === "string") {
            try {
                hostData.languages = JSON.parse(hostData.languages);
            } catch (e) {
                hostData.languages = hostData.languages.split(",").map(l => l.trim()).filter(Boolean);
            }
        }

        Object.assign(existingHost, hostData);
        if (imageUri) existingHost.imageUri = imageUri;

        await existingHost.save();
        return { success: true, message: "Host updated successfully" };
    } catch (err) {
        console.error("Error updating host:", err.message);
        return { success: false, message: "Error while updating host" };
    }
};

exports.deleteHost = async (id) => {
    try {
        const result = await Host.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            return { success: true, message: "Host deleted successfully" };
        }
        return { success: false, message: "Host not found" };
    } catch (err) {
        console.error("Error deleting host:", err.message);
        return { success: false, message: "Error while deleting host" };
    }
};

exports.updateHostStatus = async (id, status) => {
    try {
        const result = await Host.updateOne(
            { _id: id },
            { $set: { isActive: status } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: "Status updated" };
        }
        return { success: false, message: "Status not updated" };
    } catch (err) {
        console.error("Error updating host status:", err.message);
        return { success: false, message: "Error while updating host status" };
    }
};
