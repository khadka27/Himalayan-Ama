const Service = require("../model/Services");

exports.createService = async (serviceData, image) => {
    try {
        const features = serviceData.features ?
            (typeof serviceData.features === 'string' ? JSON.parse(serviceData.features) : serviceData.features)
            : [];

        const newService = new Service({
            title: serviceData.title,
            description: serviceData.description,
            icon: serviceData.icon || 'Sparkles',
            image,
            features,
            isActive: serviceData.isActive === 'true' || serviceData.isActive === true,
            order: serviceData.order ? Number(serviceData.order) : 0
        });

        const savedService = await newService.save();
        return { success: true, message: "Service created successfully", service: savedService };
    } catch (err) {
        console.error("Create Service Error:", err.message);
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
        const update = {};
        if (serviceData.title) update.title = serviceData.title;
        if (serviceData.description) update.description = serviceData.description;
        if (serviceData.icon) update.icon = serviceData.icon;
        if (image) update.image = image;

        if (serviceData.isActive !== undefined) {
            update.isActive = serviceData.isActive === 'true' || serviceData.isActive === true;
        }

        if (serviceData.order !== undefined) {
            update.order = Number(serviceData.order);
        }

        if (serviceData.features) {
            try {
                update.features = typeof serviceData.features === 'string'
                    ? JSON.parse(serviceData.features)
                    : serviceData.features;
            } catch (e) {
                console.error("Error parsing features:", e.message);
                // If it's a comma separated string but not JSON
                if (typeof serviceData.features === 'string') {
                    update.features = serviceData.features.split(',').map(f => f.trim());
                }
            }
        }

        const updatedService = await Service.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
        if (!updatedService) return { success: false, message: "Service not found" };
        return { success: true, message: "Service updated successfully", service: updatedService };
    } catch (err) {
        console.error("Update Service Error:", err.message);
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
