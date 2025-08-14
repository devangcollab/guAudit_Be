const express = require("express");

const { getRoles, getRole, updateRole, deleteRole, addRole } = require("../controller/role");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/addrole", addRole);
router.get("/getroles", getRoles);
router.get("/getrole/:id", verifyToken, getRole);
router.put("/updaterole/:id", verifyToken, updateRole);
router.put("/deleterole/:id", verifyToken, deleteRole);

module.exports = router;
                                                                    