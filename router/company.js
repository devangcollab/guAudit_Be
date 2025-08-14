const express = require("express");
const {
  addCompany,
  getCompanies,
  updateCompanybyid,
  deleteCompanybyid,
  getDeletedCompanies,
  restoreCompanybyid,
  getAllCompanies,
  getLatestCompanies,
  getCompanyById,
  searchCompany,
} = require("../controller/company");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");
const {
  validateCreateCompany,
  validateGetOneCompany,
  validateUpdateCompany,
  validateDeleteCompany,
} = require("../middleware/company");

const router = express.Router();
// checkPermission("Company", "create"), middle to addcompany and verifyToken
router.post("/addcomp", verifyToken, validateCreateCompany, addCompany);
router.get("/getallcomps", verifyToken, getAllCompanies);
router.get("/getCompany/:id", validateGetOneCompany, getCompanyById);
router.get("/selectCompany", searchCompany);
router.post("/getcomps", getCompanies);
router.get("/getLatestCompanies", verifyToken, getLatestCompanies);
router.get("/getdeletedcomps", getDeletedCompanies);
router.put(
  "/updatecompbyid/:id",
  verifyToken,
  validateUpdateCompany,
  updateCompanybyid
);
router.put(
  "/deletecompbyid/:id",
  verifyToken,
  validateDeleteCompany,
  deleteCompanybyid
);
router.put("/restorecompbyid/:id", restoreCompanybyid);

module.exports = router;
