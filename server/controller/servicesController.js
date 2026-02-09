const servicesService = require("../service/servicesService");

exports.createService = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : null;
        const result = await servicesService.createService(req.body, image);
        return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const result = await servicesService.getAllServices();
        return res.status(result.success ? 200 : 500).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getActiveServices = async (req, res) => {
    try {
        const result = await servicesService.getActiveServices();
        return res.status(result.success ? 200 : 500).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const result = await servicesService.getServiceById(req.params.id);
        return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : null;
        const result = await servicesService.updateService(req.params.id, req.body, image);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const result = await servicesService.deleteService(req.params.id);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
