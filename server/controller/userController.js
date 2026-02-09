const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../util/tokenExtractor.js");
const User = require("../model/Users.js");

exports.getUserDetails = async (req, res) => {
  try {
    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    // DONE: Find expired token here
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await User.findById(decode.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, user: existingUser });
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: true,
        message: "Token expired. Logged out successfully",
        redirect: "/",
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
};

exports.getRemoteUserDetails = async (req, res) => {
  try {
    const token = tokenExtractor(req);    
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    // DONE: Find expired token here
    const decode = jwt.verify(token, process.env.JWT_SECRET_REMOTE);

    const existingUser = await User.findById(decode.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, user: existingUser });
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: true,
        message: "Token expired, try again in the evening",
        redirect: "/",
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await User.findById(decode.id);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }

    if (existingUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized access" })
    }

    const users = await User.find({ role: "employee" });

    return res.status(200).json({ success: true, users });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user data.",
    });
  }
};

exports.updateUserDepartment = async (req, res) => {
  const { userId, department } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.department = department;
    await user.save();
    return res.status(200).json({ success: true, message: `Department updated for ${user.name}` })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "Error while updating department" })
  }
}

exports.updateUserPosition = async (req, res) => {
  const { userId, position } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.position = position;
    await user.save();
    return res.status(200).json({ success: true, message: `Employee role updated for ${user.name}` })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "Error while updating department" })
  }
}

exports.updateTimeEntries = async (req, res) => {
  try {
    const { userId, key, value } = req.body;

    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    existingUser.timeEntries[key] = value;
    await existingUser.save();
    return res.status(200).json({ success: true, message: "Entires udpated" })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "Error while updating time entires" })
  }
}