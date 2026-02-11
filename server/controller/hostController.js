const hostServices = require("../service/hostServices");

exports.getAllHosts = async (req, res) => {
    try {
        const hosts = await hostServices.getAllHosts();
        return res.status(200).json({ success: true, hosts: hosts || [] });
    } catch (err) {
        console.error("Error in getAllHosts controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while fetching hosts: ${err.message}` });
    }
};

exports.getActiveHosts = async (req, res) => {
    try {
        const hosts = await hostServices.getActiveHosts();
        return res.status(200).json({ success: true, hosts: hosts || [] });
    } catch (err) {
        console.error("Error in getActiveHosts controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while fetching active hosts: ${err.message}` });
    }
};

exports.getHost = async (req, res) => {
    try {
        const host = await hostServices.getHostById(req.params.id);
        if (!host) {
            return res.status(404).json({ success: false, message: "Host not found" });
        }
        return res.status(200).json({ success: true, host });
    } catch (err) {
        console.error("Error in getHost controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while fetching host: ${err.message}` });
    }
};

exports.addHost = async (req, res) => {
    try {
        const imageUri = req.file ? req.file.filename : undefined;

        const hostData = {
            ...req.body,
            isActive: (req.body.isActive === "true" || req.body.isActive === true)
        };

        const result = await hostServices.addHost(hostData, imageUri);

        if (result.success) {
            return res.status(201).json(result);
        }
        return res.status(400).json(result);
    } catch (err) {
        console.error("Error in addHost controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while adding host: ${err.message}` });
    }
};

exports.updateHost = async (req, res) => {
    try {
        const imageUri = req.file ? req.file.filename : undefined;

        const result = await hostServices.updateHost(req.body, imageUri);

        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (err) {
        console.error("Error in updateHost controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while updating host: ${err.message}` });
    }
};

exports.deleteHost = async (req, res) => {
    try {
        const result = await hostServices.deleteHost(req.params.id);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (err) {
        console.error("Error in deleteHost controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while deleting host: ${err.message}` });
    }
};

exports.updateHostStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;
        const result = await hostServices.updateHostStatus(_id, status);

        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (err) {
        console.error("Error in updateHostStatus controller:", err.message);
        return res.status(500).json({ success: false, message: `Error while updating host status: ${err.message}` });
    }
};
