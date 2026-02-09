const flatsService = require("../service/flatsService");

exports.createFlat = async (req, res) => {
    try {
        const images = req.files ? req.files.map(file => file.filename) : [];
        const flatData = req.body;

        const result = await flatsService.createFlat(flatData, images);
        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllFlats = async (req, res) => {
    try {
        const result = await flatsService.getAllFlats();
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPublishedFlats = async (req, res) => {
    try {
        const result = await flatsService.getPublishedFlats();
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getFlatById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await flatsService.getFlatById(id);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateFlat = async (req, res) => {
    try {
        const { id } = req.params;
        const images = req.files ? req.files.map(file => file.filename) : [];
        const flatData = req.body;

        const result = await flatsService.updateFlat(id, flatData, images);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteFlat = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await flatsService.deleteFlat(id);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateFlatStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await flatsService.updateFlatStatus(id, status);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
