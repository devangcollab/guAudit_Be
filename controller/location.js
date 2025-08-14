const company = require("../models/company");
const Location = require("../models/location");
const { funAddlog } = require("./logs");
const moment = require("moment-timezone");

exports.addLocation = async (req, res) => {
  try {
    const userId = req.user.userId;
    let {
      company,
      locationName,
      locationCode,
      fullAddress,
      zipCode,
      toMail,
      ccMail,
    } = req.body;

    const currentDate = moment().format();
    const locationCheck = await Location.findOne({ locationCode });

    if (locationCheck) {
      return res.status(400).json({
        error: true,
        message: "Location already exists with the same locationCode.",
      });
    }

    const location = await Location.create({
      company,
      locName: locationName,
      locationCode,
      address: fullAddress,
      postCode: zipCode,
      toMail,
      ccMail,
      createdBy: userId,
      dateField: currentDate,
    });

    return res.status(200).json({
      error: false,
      message: "Location Created Successfully.",
      data: location,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const { search } = req.query;
    const role = req.user.roleId;
    const compId = req.user.compId;

    // Create filter object
    const query = {
      isDelete: 0,
    };

    // If role is Admin (roleId === 2), restrict to their company locations
    if (role == 2 && compId) {
      query.company = compId; // ✅ Fix: filter by company ID, not location ID
    }

    // If search term is present, add regex filters
    if (search) {
      query.$or = [
        { locName: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { locationCode: { $regex: search, $options: "i" } },
      ];
    }

    const locationData = await Location.find(query)
      .sort({ createdAt: -1 })
      .populate("company");

    return res.status(200).json({
      error: false,
      message: "Location data fetched successfully.",
      data: locationData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [
      { compName: { $regex: search, $options: "i" } },
      { locName: { $regex: search, $options: "i" } },
      { locationCode: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
      { postCode: { $regex: search, $options: "i" } },
      { toMail: { $regex: search, $options: "i" } },
      { ccMail: { $regex: search, $options: "i" } },
    ];

    const totalCount = await Location.countDocuments({
      ...searchQuery,
      isDelete: 0,
    });
    const locationData = await Location.find({ ...searchQuery, isDelete: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    const newData = await Promise.all(
      locationData.map(async (loc) => {
        const findCompany = await company.findById(loc.compId);

        return {
          ...loc,
          compName: findCompany.name,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Location data fetched Successfully.",
      data: newData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getDeletedLocations = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    const totalCount = await Location.countDocuments({ isDelete: 1 });
    const locationData = await Location.find({ isDelete: 1 })
      .populate("company deletedBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    // const newData = await Promise.all(
    //   locationData.map(async (loc) => {
    //     const findCompany = await company.findById(loc.compId);

    //     return {
    //       ...loc,
    //       compName: findCompany.name,
    //     };
    //   })
    // );
    return res.status(200).json({
      error: false,
      message: "Location data fetched Successfully.",
      data: locationData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.updateLocationbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();

    const updateLocationData = await Location.findByIdAndUpdate(
      id,
      { ...req.body, dateField: currentDate },
      {
        new: true,
      }
    );

    if (updateLocationData) {
      funAddlog(`${updateLocationData?.name} location updated`);
    }

    return res.status(200).json({
      error: false,
      message: "Location data Edited Successfully.",
      data: updateLocationData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteLocationbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const currentDate = moment().format();

    const deletedLocationData = await Location.findByIdAndUpdate(
      id,
      { isDelete: 1, deletedBy: userId, dateField: currentDate },
      {
        new: true,
      }
    );

    if (deletedLocationData) {
      funAddlog(`${deletedLocationData?.name} location deleted`);
    }

    return res.status(200).json({
      error: false,
      message: "Location Deleted Successfully",
      data: deletedLocationData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.restoreLocationbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();

    const restoredLocationData = await Location.findByIdAndUpdate(
      id,
      { isDelete: 0, dateField: currentDate },
      {
        new: true,
      }
    );

    if (restoredLocationData) {
      funAddlog(`${restoredLocationData?.name} location restored`);
    }

    return res.status(200).json({
      error: false,
      message: "Location Restored Successfully",
      data: restoredLocationData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const locId = req.params.id;
    const location = await Location.findById(locId).populate("company");
    if (!location) {
      return res.status(404).json({ message: "No Location found" });
    }
    return res.status(200).json({
      message: "Location retrieved successfully",
      data: location,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.selectLocationByCompany = async (req, res) => {
  try {
    const locText = req.query.text || "";
    const companyId = req.params.id;

    let findObject = { isDelete: 0 };

    if (locText.trim() !== "") {
      findObject.$or = [{ locName: { $regex: `^${locText}`, $options: "i" } }];
    }

    if (companyId) {
      findObject.company = companyId;
    }

    const locationData = await Location.find(findObject).limit(5);

    if (!locationData) {
      return res.status(404).json({ message: "No Location found" });
    }

    return res.status(200).json({
      message: "Location retrieved successfully",
      data: locationData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
