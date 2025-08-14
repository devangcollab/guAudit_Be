const express = require("express");
const {
  logIn,
  signUp,
  getOtp,
  getuserbytoken,
  getusers,
  logOut,
} = require("../controller/auth");
const router = express.Router();

router.post("/getotp", getOtp);
router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/getuserbytoken", getuserbytoken);
router.post("/logout", logOut);
// router.get("/getusers", getusers);

module.exports = router;