const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const User = require("../model/Users")

const authMiddleware = async (req, res, next) => {
    let token = req.headers['auth'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const exisitingUser = await User.findById(decoded.id);
        if (!exisitingUser) {
            return res.status(401).json({ success: false, message: "Unauthorized access" })
        }
        req.user = exisitingUser;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
