const jwt = require("jsonwebtoken");

const User = require("../model/Users.js");

const { oauth2client } = require("../util/googleConfig.js");
const ALLOWED_DOMAIN = "@fishtailinfosolutions.com";
const { tokenExtractor } = require("../util/tokenExtractor.js");

exports.login = async (req, res) => {
  try {
    const { code } = req.body;
    const googleResponse = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleResponse.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`,
      {
        method: "GET",
      }
    );

    const { email, name, picture } = await userRes.json();

    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return res
        .status(403)
        .json({ success: false, message: `${ALLOWED_DOMAIN} is accepted.` });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        email,
        name,
        profileUri: picture,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TIMEOUT,
        }
      );

      return res.status(200).json({ success: true, message: "Account created and logged in", redirect: "/dashboard", token })

    } else {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TIMEOUT,
        }
      );
      // return res
      //   .cookie("auth", token, {
      //     httpOnly: process.env.NODE_ENV == "production",
      //     secure: process.env.NODE_ENV == "production",
      //     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      //     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      //   })
      //   .json({
      //     success: true,
      //     message: "logged in successfully",
      //     redirect: "/dashboard",
      //   });

      return res.status(200).json({ success: true, message: "Logged in", redirect: "/dashboard", token })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while logging in",
      error: err.message,
    });
  }
};

// Server based redirection
// exports.checkToken = async (req, res) => {
//   console.log("Hit");

//   try {
//     const token = tokenExtractor(req);
//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decode);

//     const existingUser = await User.findById(decode.id);
//     console.log(existingUser);
//     if (!existingUser) {
//       return res.status(404).json({ success: false});
//     }

//     return res.status(200).json({ success: true, message: `Redirecting ${existingUser.name}` })

//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res
//         .clearCookie("auth", {
//           httpOnly: process.env.NODE_ENV === "production",
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//           path: "/",
//         })
//         .json({
//           success: true,
//           message: "Token expired. Logged out successfully",
//           redirect: "/",
//         });
//     } else {
//       return res.status(401).json({ success: false, message: "Try again later" });
//     }
//   }
// };
