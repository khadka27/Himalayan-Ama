const Service = require("../model/Services");

exports.createService = async (serviceData, image) => {
    try {
        const newService = new Service({
            ...serviceData,
            image,
            features: serviceData.features ? JSON.parse(serviceData.features) : []
        });
        const savedService = await newService.save();
        return { success: true, message: "Service created successfully", service: savedService };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.getAllServices = async () => {
    try {
        const services = await Service.find().sort({ order: 1 });
        return { success: true, services };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.getActiveServices = async () => {
    try {
        const services = await Service.find({ isActive: true }).sort({ order: 1 });
        return { success: true, services };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.getServiceById = async (id) => {
    try {
        const service = await Service.findById(id);
        if (!service) return { success: false, message: "Service not found" };
        return { success: true, service };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.updateService = async (id, serviceData, image) => {
    try {
        const update = { ...serviceData };
        if (image) update.image = image;
        if (serviceData.features) update.features = JSON.parse(serviceData.features);

        const updatedService = await Service.findByIdAndUpdate(id, update, { new: true });
        if (!updatedService) return { success: false, message: "Service not found" };
        return { success: true, message: "Service updated successfully", service: updatedService };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

exports.deleteService = async (id) => {
    try {
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) return { success: false, message: "Service not found" };
        return { success: true, message: "Service deleted successfully" };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
