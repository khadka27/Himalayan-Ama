const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const User = require("../model/Users")

const authMiddleware = async (req, res, next) => {
    const token = req.headers['auth'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const exisitingUser = await User.findById(decoded.id);
        if (!exisitingUser) {
            return res.status(401).json({ success: false, message: "Unauthorized access" })
        }
        if (exisitingUser.role !== "super") {
            return res.status(403).json({ success: false, message: "Admin privileges required" })
        }
        req.user = exisitingUser;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
