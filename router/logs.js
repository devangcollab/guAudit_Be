const express = require("express");

const {
  addlog,
  getlogs,
  getlogbyuserid,
  deletelogbyid,
} = require("../controller/logs");

const router = express.Router();

router.post("/addlog", addlog);
router.get("/getlogs", getlogs);
router.post("/getlogbyuserid/:uId", getlogbyuserid);
router.post("/deletelogbyid/:id", deletelogbyid);

module.exports = router;
