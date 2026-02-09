const offerServices = require("../service/offerServices");

exports.getAllOffers = async (req, res) => {
    const result = await offerServices.getAllOffers();
    if (result.success) return res.status(200).json(result);
    return res.status(500).json(result);
};

exports.getActiveOffers = async (req, res) => {
    const result = await offerServices.getActiveOffers();
    if (result.success) return res.status(200).json(result);
    return res.status(500).json(result);
};

exports.addOffer = async (req, res) => {
    const result = await offerServices.addOffer(req.body);
    if (result.success) return res.status(201).json(result);
    return res.status(400).json(result);
};

exports.updateOffer = async (req, res) => {
    const { id } = req.params;
    const result = await offerServices.updateOffer(id, req.body);
    if (result.success) return res.status(200).json(result);
    return res.status(400).json(result);
};

exports.deleteOffer = async (req, res) => {
    const { id } = req.params;
    const result = await offerServices.deleteOffer(id);
    if (result.success) return res.status(200).json(result);
    return res.status(400).json(result);
};
