const express = require("express");
const {
  getusers,
  updateuserbyid,
  getuserbytoken,
  deleteuserbyid,
  getLatestUsers,
  createUser,
  getUserByLocationId,
  getUserById,
  getdeletedUsers,
  restoreUserById,
} = require("../controller/user");
const verifyToken = require("../middleware/verifyToken");
const {
  validateCreateUser,
  validateDeleteUser,
  validateUpdateUser,
  validateGetOneUser,
} = require("../middleware/user");

const router = express.Router();

//verifyToken ====== middle of getusers
router.get("/getusers", verifyToken, getusers);
router.get("/getuser/:id", verifyToken, validateGetOneUser, getUserById);
router.get("/getLatestUsers", getLatestUsers);
router.put(
  "/updateuserbyid/:id",
  verifyToken,
  validateUpdateUser,
  updateuserbyid
);
router.put("/deleteuserbyid/:id", validateDeleteUser, deleteuserbyid);
router.post("/getuserbytoken", getuserbytoken);
router.post("/createUser", validateCreateUser, createUser);
router.get("/getUserByLocationId/:id", getUserByLocationId);
router.get("/getDeletedUsers", verifyToken, getdeletedUsers);
router.put("/restoreUserById/:id", restoreUserById);

module.exports = router;
