const Banner = require("../model/Banner");

exports.getBanner = async () => {
    try {
        let banner = await Banner.findOne();
        if (!banner) {
            // Create a default one if none exists
            banner = await Banner.create({});
        }
        return { success: true, banner };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.updateBanner = async (bannerData) => {
    try {
        let banner = await Banner.findOne();
        if (!banner) {
            banner = await Banner.create(bannerData);
        } else {
            banner = await Banner.findByIdAndUpdate(banner._id, bannerData, { new: true });
        }
        return { success: true, message: "Banner updated", banner };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
