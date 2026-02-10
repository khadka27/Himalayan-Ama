const Inquiry = require("../model/Inquiries");

const createInquiry = async (data) => {
    return await Inquiry.create(data);
};

const getAllInquiries = async () => {
    return await Inquiry.find().sort({ createdAt: -1 });
};

module.exports = {
    createInquiry,
    getAllInquiries
};
