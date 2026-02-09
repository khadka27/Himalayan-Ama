const jwt = require("jsonwebtoken")
const User = require("../model/Users")

const {
    hashPassword,
    comparePassword,
} = require("../util/hashing");

exports.login = async (user) => {
    try {
        const existingUser = await User.findOne({ email: user.email }).select("+password");
        if (!existingUser) return { success: false, message: "User doesn't exists" };

        const result = await comparePassword(user.password, existingUser.password);
        if (!result) return { success: false, message: "Invalid username or password" }

        const token = jwt.sign(
            {
                id: existingUser.id,
                role: existingUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT,
            }
        );

        const userData = {
            id: existingUser.id,
            userName: existingUser.userName,
            email: existingUser.email,
            role: existingUser.role,
        };

        return { success: true, message: "Logged in successfully", token, user: userData, redirect: "/admin/dashboard" };
    } catch (err) {
        console.log(err);
        return { success: false, message: "Error while logging in" }

    }
}

exports.signup = async (user) => {
    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) return { success: false, message: `User with ${user.email} already exists` }

        const hashedPassword = await hashPassword(user.password, 12);

        const newuser = new User({
            userName: user.userName,
            email: user.email,
            password: hashedPassword,
        });

        await newuser.save();

        return { success: true, message: "User created", redirect: "/admin/login" }
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while signing in" }
    }
}

// User Management Functions (Super Admin Only)
exports.getAllUsers = () => User.find({}).select("+password");

exports.getUser = (id) => User.findById(id);

exports.addUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) return { success: false, message: `User with ${userData.email} already exists` };

        const hashedPassword = await hashPassword(userData.password, 12);

        const newUser = new User({
            userName: userData.userName,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || "admin"
        });

        await newUser.save();
        return { success: true, message: "User created successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while creating user" };
    }
}

exports.updateUser = async (userData) => {
    try {
        const existingUser = await User.findById(userData._id);
        if (!existingUser) return { success: false, message: "User doesn't exist" };

        // Update fields
        existingUser.userName = userData.userName || existingUser.userName;
        existingUser.email = userData.email || existingUser.email;
        existingUser.role = userData.role || existingUser.role;

        // Only update password if provided
        if (userData.password) {
            existingUser.password = await hashPassword(userData.password, 12);
        }

        await existingUser.save();
        return { success: true, message: "User updated successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating user" };
    }
}

exports.deleteUser = async (id) => {
    try {
        const result = await User.findByIdAndDelete(id);
        if (!result) return { success: false, message: "User not found" };

        return { success: true, message: "User deleted successfully" };
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while deleting user" };
    }
}

exports.updateUserStatus = async (_id, status) => {
    try {
        const result = await User.updateOne(
            { _id },
            { $set: { isActive: status } }
        );

        if (result.modifiedCount === 1) {
            return { success: true, message: "User status updated" }
        } else {
            return { success: false, message: "User status not updated" }
        }
    } catch (err) {
        console.log(err.message);
        return { success: false, message: "Error while updating user status" };
    }
};
