const User = require("../models/user");
const Role = require("../models/role");
const JWT = require("jsonwebtoken");
const { createUserServices } = require("../services/user");

exports.getusers = async (req, res) => {
  try {
    const role = req.user.roleId;
    const compId = req.user.compId;

    const findObject = {
      isDelete: 0,
    };

    if (role === 2 && compId) {
      findObject.compId = compId;
    }

    const users = await User.find(findObject)
      .sort({ createdAt: -1 })
      .populate("compId locId role");

    return res.status(200).json({
      error: false,
      message: "User Data Get Successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("compId locId");

    return res.status(200).json({
      error: false,
      message: "User Get Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.updateuserbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const updateuser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      error: false,
      message: "User Updated Successfully",
      data: updateuser,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteuserbyid = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDelete: 1 },
      {
        new: true,
      }
    );

    return res.status(200).json({
      error: false,
      message: "User Deleted Successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getuserbytoken = async (req, res) => {
  try {
    const { token } = req.body;

    var decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    const { userId } = decoded;

    const user = await User.findById(userId).select("-password");
    const roleData = await Role.findById(user?.role);

    return res.status(200).json({
      error: false,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: roleData,
      },
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getLatestUsers = async (req, res) => {
  try {
    const users = await User.find({ isDelete: 0 })
      .sort({ createdAt: -1 }) // newest first
      .limit(5);

    return res.status(200).json({
      error: false,
      message: "User Data Get Successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    const userData = await createUserServices(data);
    return res.status(200).json({ message: "User created", data: userData });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getUserByLocationId = async (req, res) => {
  try {
    const locId = req.params.id;

    // Fetch users with populated role
    const users = await User.find({ isDelete: 0, locId })
      .sort({ createdAt: -1 })
      .populate("compId locId role");

    // Filter users whose role.roleId === 1
    const filteredUsers = users.filter((user) => user?.role?.roleId === 1);

    return res.status(200).json({
      error: false,
      message: "User Data Get Successfully",
      data: filteredUsers,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(400).json({ error });
  }
};

exports.getdeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDelete: 1 })
      .populate("compId locId")
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      error: false,
      message: "Deleted Users Data Get Successfully",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
exports.restoreUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndUpdate(
      id,
      { isDelete: 0 },
      {
        new: true,
      }
    );
    return res.status(200).json({
      error: false,
      message: "Restore User Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
