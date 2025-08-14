const Log = require("../models/logs");
const JWT = require("jsonwebtoken");

exports.funAddlog = async (token, activityName) => {
    try {

        // var decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

        // const { userId } = decoded;

        await Log.create({
            // userId,
            activityName,
        });

        return { error: false }
    } catch (error) {
        return { error: true }
    }
};

exports.addlog = async (req, res) => {
    try {
        const {
            userId,
            activityName,
        } = req.body;

        const logData = await Log.create({
            userId,
            activityName,
        });

        return res.status(200).json({
            error: false, data: logData,
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

exports.getlogs = async (req, res) => {
    try {

        const getLogs = await Log.find({ isDelete: 0 }).sort({ createdAt: -1 });
        return res.status(200).json({ error: false, data: getLogs });

    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.getlogbyuserid = async (req, res) => {
    try {

        const { uId } = req.params;
        const getlog = await Log.find({ userId: uId }).sort({ createdAt: -1 });
        return res.status(200).json({ error: false, data: getlog });

    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.deletelogbyid = async (req, res) => {
    try {

        const { id } = req.params;
        const deleteLog = await Log.findByIdAndUpdate(id, { isDelete: 1 }, { new: true });
        return res.status(200).json({ error: false, data: deleteLog });

    } catch (error) {
        return res.status(400).json({ error });
    }
};
