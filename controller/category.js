const Category = require("../models/category");

exports.addCategory = async (req, res) => {
  try {
    const userId = req.user.userId

    const { categoryName } = req.body;
    const categoryData = await Category.create({ name : categoryName , createdBy : userId });

    return res.status(200).json({
      error: false,
      message: "Category Created Successfully",
      data: categoryData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.getOneCategory = async (req, res) => {

  const catId = req.params.id

  try {
    const category = await Category.findById(catId)
    return res.status(200).json({
      error: false,
      message: "Category Get Successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};



exports.getAllCategories = async (req, res) => {
  try {
    const categorysData = await Category.find({isDelete : 0}).sort({
      createdAt: -1,
    }).populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Category Data Get Successfully",
      data: categorysData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};
exports.updateCategorybyid = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, ...rest } = req.body;

  
    const data = {
      ...rest,
      name: categoryName,  
    };

    const updatecategoryData = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });

    return res.status(200).json({
      error: false,
      message: "Category Updated Successfully",
      data: updatecategoryData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};

exports.deleteCategorybyid = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params;

    const deletedcategoryData = await Category.findByIdAndUpdate(
      id,
      { isDelete: 1 , deletedBy:userId },
      {
        new: true,               
      }
    );

    return res.status(200).json({
      error: false,
      message: "Category Deleted Successfully",
      data: deletedcategoryData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};



exports.getDeletedCategories = async (req, res) => {
  try {
    const categorysData = await Category.find({isDelete : 1}).sort({
      createdAt: -1,
    }).populate("deletedBy");

    return res.status(200).json({
      error: false,
      message: "Category Data Get Successfully",
      data: categorysData,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};


exports.restoreCategorybyid = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Category.findByIdAndUpdate(
      id,
      { isDelete: 0},
      {
        new: true,
      }
    );

    // if (data) {
    //   funAddlog(`${data?.name} Category restored`);
    // }

    return res.status(200).json({
      error: false,
      message: "Category Restored Successfully",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
};



exports.selectCategory = async (req, res) => {
  try {
    const catText = req.query.text || "";
    let findObject = {isDelete:0 };

      if (catText.trim() !== "") {
    findObject.$or = [
      { name: { $regex: `^${catText}`, $options: "i" } },
    ];
  }


    const category = await Category.find(findObject).limit(5);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res
      .status(200)
      .json({ message: "Category searched successfully", data: category });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};