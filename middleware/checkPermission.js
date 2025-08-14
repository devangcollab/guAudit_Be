const Role = require("../models/role");

const checkPermission = (moduleName, actionName) => {
  return async (req, res, next) => {
    try {
      const { roleId } = req.user;

      
      if (!roleId) {
        return res.status(403).json({
          error: true,
          message: "Access denied: role not found.",
        });
      }

      const role = await Role.find({roleId : Number(roleId)});

      if (!role || role.isDelete) {
        return res.status(403).json({
          error: true,
          message: "Role is inactive or does not exist.",
        });
      }


      const hasPermission = role[0].permissions.some((perm) => {
        const moduleMatch = perm.module.trim().toLowerCase() === moduleName.trim().toLowerCase();
        const actionMatch = perm.actions.includes(actionName);
        return moduleMatch && actionMatch;
      });

      if (!hasPermission) {
        return res.status(403).json({
          error: true,
          message: "You don't have permission to perform this action.",
        });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({
        error: true,
        message: "Something went wrong while checking permissions.",
      });
    }
  };
};


module.exports = checkPermission;
