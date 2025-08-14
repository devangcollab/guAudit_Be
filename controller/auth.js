const User = require("../models/user");
// const Role = require("../models/role");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// exports.signUp = async (req, res) => {
//   try {
//     const data = req.body;
//     const { name, password, phone, email, mobileNo, role } = data;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const isExistsUser = await User.findOne({ email });
//     if (isExistsUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const userData = {
//       name,
//       email,
//       phone,
//       mobileNo,
//       password: hashedPassword,
//       role,
//     };
//     const user = await User.create(userData);
//     return res
//       .status(201)
//       .json({ message: "User register successfully", data: user });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "internal server error", error: error.message });
//   }
// };

exports.getOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect login credentials." });
    }

    if (user.isDelete == "1") {
      return res.status(400).json({
        error: true,
        message: "You can't login please contact your admin.",
      });
    }

    let otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    user.otp = otp;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: `${process.env.MAIL_ID}`,
        pass: `${process.env.MAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: `${process.env.MAIL_ID}`,
      to: email,
      subject: "OTP Code for authentication",
      html: `<p>This mail from <i><b> goAudit </b></i> for authentication. <br>
              The code required for the login is <b>${otp}</b></p>`,
    };

    console.log(otp , "otp")

    try {
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          return res.status(400).json({ err, success: false });
        } else {
          return res.status(200).json({
            error: false,
            message: `OTP sent to your registered Email-Id.`,
            success: true,
          });
        }
      });
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }

    return res.status(200).json({
      error: false,
      message: "User login successful.",
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, otp, keepLoggedIn } = req.body;

    const user = await User.findOne({ email }).populate("role");
    

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect login credentials." });
    }

    if (user.isDelete == "1") {
      return res.status(400).json({
        error: true,
        message: "You can't login please contact your admin.",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({ error: true, message: "Incorrect OTP." });
    }
    user.otp = null

    JWT_DATA ={
    userId: user._id,
    roleId:user.role.roleId,
    compId:user.compId,
    locId:user.locId,
      ...user
    // role: user.role, // 'SA' | 'A' | 'U'
  }

    const token = JWT.sign(JWT_DATA, process.env.JWT_SECRET_KEY, {
      // expiresIn: keepLoggedIn ? "48h" : "40h",
    });

    return res.status(200).json({
      error: false,
      message: "User login successful.",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role:user.role.roleName,
        compId:user.compId,
        locId:user.locId
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

// exports.logIn = async (req, res) => {
//   try {
//     const { email, password , keepLoggedIn } = req.body;
//     const user = await User.findOne({email});

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isRightPassword = await bcrypt.compare(password, user.password);

//     const jwtData = {
//       id: user._id,
//       email: user.email,
//       role: user.role || "",
//     };
//     if (isRightPassword) {
//       const token = JWT.sign(jwtData, process.env.JWT_SECRET_KEY ,  {expiresIn: keepLoggedIn ? "48h" : "1h"},);
//       // await createLogActivity(jwtData, `login ${user.name}`);

//       return res
//         .status(200)
//         .json({ message: "login successfully", token: token, role: user });
//     } else {
//       return res.status(400).json({ message: "wrong password" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "internal server error", error: error.message });
//   }
// };

exports.getuserbytoken = async (req, res) => {
  try {
    const { token } = req.body;

    var decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    const { userId } = decoded;

    const user = await User.findById(userId).select("-password");
    return res.status(200).json({ error: false, data: user });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getusers = async (req, res) => {
  try {
    const users = await User.find({ isDelete: 0 }).sort({ createdAt: -1 });

    return res.status(200).json({
      error: false,
      message: "User Data Get Successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};




exports.signUp = async (req, res) => {
  try {
    const data = req.body;
    const { name, password, phone, email, mobileNo, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isExistsUser = await User.findOne({ email });
    if (isExistsUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userData = {
      name,
      email,
      phone,
      mobileNo,
      password: hashedPassword,
      role,
    };
    const user = await User.create(userData);
    return res
      .status(201)
      .json({ message: "User register successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};



exports.logOut = async (req, res) => {
    try {

      

        // Clear any cookies (if used alongside localStorage)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Optionally blacklist the token on the server (requires Redis or DB)
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            // Example: Add token to blacklist (uncomment if using Redis)
            // await redisClient.set(token, 'blacklisted', { EX: 3600 });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};