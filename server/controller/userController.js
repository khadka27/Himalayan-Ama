const userService = require("../service/userService");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }
        return res.status(200).json({ success: true, users });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching users: ${err.message}` });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await userService.getUser(req.query.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while fetching user: ${err.message}` });
    }
}

exports.addUser = async (req, res) => {
    try {
        const result = await userService.addUser(req.body);

        if (result.success) return res.status(201).json(result || { success: true, message: "User created" });
        return res.status(400).json(result || { success: false, message: "User not created" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while creating user: ${err.message}` });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.body);

        if (result.success) return res.status(200).json(result || { success: true, message: "User updated" });
        return res.status(404).json(result || { success: false, message: "User not updated" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating user: ${err.message}` });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.query.id || req.body.id);

        if (result.success) return res.status(200).json(result || { success: true, message: "User deleted" });
        return res.status(404).json(result || { success: false, message: "User not deleted" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while deleting user: ${err.message}` });
    }
}

exports.updateUserStatus = async (req, res) => {
    try {
        const { _id, isActive } = req.body;
        const result = await userService.updateUserStatus(_id, isActive);

        if (result.success) return res.status(200).json(result || { success: true, message: "User status updated" });
        return res.status(404).json(result || { success: false, message: "User status not updated" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: `Error while updating user status: ${err.message}` });
    }
}
