const Role = require("../models/role");

exports.addRole = async (req, res) => {
    try {
        const role = req.body;
        
        const data = await Role.create(role);

        return res.status(200).json({
            error: false,
            message: "Role Created Successfully",
            data: data,
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const data = await Role.find({ isDelete: 0 }).sort({ createdAt: -1 });

        return res.status(200).json({
            error: false,
            data: data,
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.getRole = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Role.findById(id);

        return res.status(200).json({
            error: false,
            data: data,
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Role.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        return res.status(200).json({
            error: false,
            message: "Role Updated Successfully",
            data: data
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Role.findByIdAndUpdate(id, { isDelete: 1 }, {
            new: true,
        });

        return res.status(200).json({
            error: false,
            message: "Role Deleted Successfully",
            data: data
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};