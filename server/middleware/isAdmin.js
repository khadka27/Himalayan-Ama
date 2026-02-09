const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../util/tokenExtractor")
const User = require("../model/Users");

exports.isAdmin = async (req, res, next) => {
    const token = tokenExtractor(req);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const existingUser = await User.findById(decoded.id);
        if (existingUser) {
            if (existingUser.role === "admin") {
                req.user = existingUser;
                next();
            } else {
                return res.status(403).json({ success: false, message: "Try being an actual admin ;)" });
            }
        } else {
            return res.status(401).json({ message: "Error in Admin verification" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};