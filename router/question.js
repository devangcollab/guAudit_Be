const express = require("express");
const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionById,
  getDeletedQuestions,
  restoreQuestionById,
  assignQuestion,
  getUserAssignedQuestions,
  getAssignedUserIds,
  getAuditData,
} = require("../controller/question");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/getallquestions", getAllQuestions);
router.post("/addquestion", verifyToken, addQuestion);
router.post("/getquestions", getQuestions);
router.get("/getDeletedquestions", getDeletedQuestions);
router.get("/getQuestionById/:id", getQuestionById);
router.put("/updatequestionbyid/:id", updateQuestion);
router.put("/deletequestionbyid/:id", verifyToken, deleteQuestion);
router.put("/restorequestionbyid/:id", restoreQuestionById);
router.put("/assignQuestions/:id", assignQuestion);
router.get("/userAssignQuestions",verifyToken, getUserAssignedQuestions);
router.get("/getAssignedUserIds/:id", getAssignedUserIds);
// router.get("/getAuditData",verifyToken , getAuditData);

module.exports = router;