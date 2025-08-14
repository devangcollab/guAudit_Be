const { body, param, validationResult } = require("express-validator");

// Validation: Create User
exports.validateCreateUser = [
  body("name").isString().notEmpty().withMessage("name is required"),
  body("email").isEmail().notEmpty().withMessage("email is required"),
  body("phone").isString().notEmpty().withMessage("phone is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation: Get One User (by ID)
exports.validateGetOneUser = [
  param("id").optional().isMongoId().withMessage("valid Mongo ID required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation: Delete User (by ID)
exports.validateDeleteUser = [
  param("id").isMongoId().withMessage("valid Mongo ID required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation: Update User
exports.validateUpdateUser = [
  body("name").optional().isString().withMessage("name must be a string"),
  body("email").optional().isEmail().withMessage("email must be valid"),
  body("phone").optional().isString().withMessage("phone must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
