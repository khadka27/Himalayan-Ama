const inquiryService = require("../service/inquiryService");

const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, message, flat } = req.body;
        const inquiryData = {
            name,
            email,
            phone,
            message,
            flat
        }
        const inquiry = await inquiryService.createInquiry(inquiryData);
        res.status(201).json({ success: true, data: inquiry, message: "Inquiry received successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryService.getAllInquiries();
        res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createInquiry,
    getAllInquiries
};
