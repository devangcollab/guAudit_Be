const Company = require("../models/company");
const { funAddlog } = require("./logs");
const moment = require("moment-timezone");

exports.addCompany = async (req, res) => {
  try {
    const userId = req.user.userId;
    let { compLogo, name, shortName } = req.body;

    const currentDate = moment().format();
    const companyCheck = await Company.findOne({ name });

    if (companyCheck) {
      return res.status(400).json({
        error: true,
        message: "Company already exists with the same name.",
      });
    }

    const company = await Company.create({
      compLogo,
      name,
      shortName,
      createdBy:userId,
      dateField: currentDate,
    });

    return res.status(200).json({
      error: false,
      message: "Company Created Successfully.",
      data: company,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.getAllCompanies = async (req, res) => {
  try {

    const role = req.user.roleId
    const compId = req.user.compId

    let companyData;

    if(role == 3){ 
      companyData = await Company.find({ isDelete: 0 })
      .sort({ createdAt: 1 }).populate("createdBy")
    }
    if(role == 2){
      companyData = await Company.find({ isDelete: 0 , _id:compId })
      .sort({ createdAt: 1 }).populate("createdBy")
    }

    return res.status(200).json({
      error: false,
      message: "Company data fetched Successfully.",
      data: companyData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { shortName: { $regex: search, $options: "i" } },
    ];

    const totalCount = await Company.countDocuments({
      ...searchQuery,
      isDelete: 0,
    });
    const companyData = await Company.find({ ...searchQuery, isDelete: 0 })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    return res.status(200).json({
      error: false,
      message: "Company data fetched Successfully.",
      data: companyData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getDeletedCompanies = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, search = "" } = req.body;

    const skip = page * pageSize;

    let searchQuery = {};
    searchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { shortName: { $regex: search, $options: "i" } },
    ];

    const totalCount = await Company.countDocuments({
      ...searchQuery,
      isDelete: 1,
    });
    const companyData = await Company.find({  ...searchQuery,isDelete: 1 })
    .sort({createdAt: 1,}).skip(skip).populate("deletedBy")
    .limit(pageSize)
    .lean()
    .exec();

    return res.status(200).json({
      error: false,
      message: "Deleted Company data fetched Successfully.",
      data: companyData,
      totalCount,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.updateCompanybyid = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();

    const updateCompanyData = await Company.findByIdAndUpdate(
      id,
      { ...req.body, dateField: currentDate },
      {
        new: true,
      }
    );

    if (updateCompanyData) {
      funAddlog(`${updateCompanyData?.name} company updated`);
    }

    return res.status(200).json({
      error: false,
      message: "Company data Edited Successfully.",
      data: updateCompanyData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.deleteCompanybyid = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId
    // const userId = req.user.id;
    const currentDate = moment().format();

    const deletedCompanyData = await Company.findByIdAndUpdate(
      id,
      { isDelete: 1, deletedBy: userId, dateField: currentDate },
      {
        new: true,
      }
    );

    if (deletedCompanyData) {
      funAddlog(`${deletedCompanyData?.name} company deleted`);
    }

    return res.status(200).json({
      error: false,
      message: "Company Deleted Successfully",
      data: deletedCompanyData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.restoreCompanybyid = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = moment().format();

    const restoredCompanyData = await Company.findByIdAndUpdate(
      id,
      { isDelete: 0, dateField: currentDate },
      {
        new: true,
      }
    );

    if (restoredCompanyData) {
      funAddlog(`${restoredCompanyData?.name} company restored`);
    }

    return res.status(200).json({
      error: false,
      message: "Company Restored Successfully",
      data: restoredCompanyData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};



exports.getLatestCompanies = async (req, res) => {
  try {
    const companyData = await Company.find({ isDelete: 0 })
      .sort({ createdAt: -1 }) // newest first
      .limit(7);               // only latest 5 companies

    return res.status(200).json({
      error: false,
      message: "Latest companies fetched successfully.",
      data: companyData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};




exports.getCompanyById = async (req, res) => {
  try {
    const compId = req.params.id;
    const comp = await Company.findById(compId);
    if (!comp) {
      return res.status(404).json({ message: "No Company found" });
    }
    return res.status(200).json({
      message: "Company retrieved successfully",
      data: comp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.searchCompany = async (req, res) => {
  try {
    const compText = req.query.text || "";
    let findObject = {isDelete:0 };

      if (compText.trim() !== "") {
    findObject.$or = [
      { name: { $regex: `^${compText}`, $options: "i" } },
    ];
  }


    const company = await Company.find(findObject).limit(5);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res
      .status(200)
      .json({ message: "Company searched successfully", data: company });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};