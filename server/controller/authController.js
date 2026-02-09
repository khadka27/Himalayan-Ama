const jwt = require("jsonwebtoken")
const User = require("../model/Users")

const userService = require("../service/userService.js")

exports.login = async (req, res) => {
    try {
        const result = await userService.login(req.body);

        if (result.success) return res.status(201).json(result || { success: true, message: "Logged in", token: checkLogin, redirect: "/admin/dashboard" })
        return res.status(400).json(result || { success: false, message: "Invalid credentials" })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "Error while logging in" })
    }
}

exports.signup = async (req, res) => {
    try {
        const result = await userService.signup(req.body);

        if (result.success) return res.status(201).json(result || { success: true, message: "User created", redirect: "/admin/login" });
        return res.status(400).json(result || { success: false, message: "Error while signing up" })
    } catch (err) {
        console.error("Signup error:", err);
        return res
            .status(500)
            .json({ success: false, message: "Error while signing up" });
    }
}