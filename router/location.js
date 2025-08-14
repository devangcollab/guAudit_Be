const express = require("express");
const {
  addLocation,
  getLocations,
  updateLocationbyid,
  deleteLocationbyid,
  getDeletedLocations,
  restoreLocationbyid,
  getAllLocations,
  getLocationById,
  selectLocationByCompany,
} = require("../controller/location");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/addlocation",verifyToken, addLocation);
router.get("/getalllocations",verifyToken, getAllLocations);
router.get("/getlocation/:id", getLocationById);
router.post("/getlocations", getLocations);
router.get("/selectLocationByCompany/:id", selectLocationByCompany);
router.get("/getdeletedlocations", getDeletedLocations);
router.put("/updatelocationbyid/:id", updateLocationbyid);
router.put("/deletelocationbyid/:id",verifyToken, deleteLocationbyid);
router.put("/restorelocationbyid/:id", restoreLocationbyid);

module.exports = router;
