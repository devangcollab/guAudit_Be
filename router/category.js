const express = require("express");
const { deleteCategorybyid, addCategory, getAllCategories, updateCategorybyid, getOneCategory, getDeletedCategories, restoreCategorybyid, selectCategory } = require("../controller/category");
const verifyToken = require("../middleware/verifyToken");
const { validateCreateCategory, validateGetOneCategory, validateUpdateCategory, validateDeleteCategory } = require("../middleware/category");

const router = express.Router();

router.post("/addcategory", verifyToken, validateCreateCategory,addCategory);
router.get("/getallcategories", getAllCategories);
router.get("/getOneCategory/:id",validateGetOneCategory, getOneCategory);
router.get("/getDeletedCategory", getDeletedCategories);
router.get("/selectCategory" , selectCategory)
router.put("/updatecategorybyid/:id", validateUpdateCategory,updateCategorybyid);
router.put("/deletecategorybyid/:id",verifyToken, validateDeleteCategory, deleteCategorybyid);
router.put("/restorecatbyid/:id", restoreCategorybyid);

module.exports = router;
