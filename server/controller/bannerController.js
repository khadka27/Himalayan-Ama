const bannerServices = require("../service/bannerServices");

exports.getBanner = async (req, res) => {
    const result = await bannerServices.getBanner();
    if (result.success) return res.status(200).json(result);
    return res.status(500).json(result);
};

exports.updateBanner = async (req, res) => {
    // Only admins should be able to update
    const result = await bannerServices.updateBanner(req.body);
    if (result.success) return res.status(200).json(result);
    return res.status(500).json(result);
};
