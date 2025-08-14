const express = require("express");
const {
  addForm,
  getForms,
  getFormbyLocId,
  getAllForms,
  updateForm,
  checkUserAssignment,
  selectAudit,
  getFormById,
  getAuditByQuestionId,
  getCompletedForms,
 
} = require("../controller/form");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/addform",verifyToken, addForm);
router.get("/getforms",verifyToken, getForms);
router.get("/getAllForms",verifyToken, getAllForms);
router.get("/getformbylocid/:locId", getFormbyLocId);
router.put("/updateForm/:id",verifyToken , updateForm);
router.get("/checkUserAssignment/:id" , checkUserAssignment);
router.get("/getSelectedAudits" , selectAudit)
router.get("/getAuditByQuestionId/:id" , getAuditByQuestionId)
router.get("/getCompletedForms" ,verifyToken , getCompletedForms)

module.exports = router;