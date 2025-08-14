const { body, param, validationResult } = require("express-validator");

// 📌 Validate Create Company
exports.validateCreateCompany = [
  body("name").isString().notEmpty().withMessage("Company name is required"),

  body("shortName")
    .optional()
    .isString()
    .withMessage("Short name must be a string"),

  body("compLogo")
    .optional()
    .isString()
    .withMessage("Logo must be a base64 string or URL"),

  body("dateField")
    .optional()
    .isString()
    .withMessage("Date field must be a string (e.g., ISO format)"),

  body("userId")
    .optional()
    .isMongoId()
    .withMessage("userId must be a valid Mongo ID"),

  body("createdBy")
    .optional()
    .isMongoId()
    .withMessage("createdBy must be a valid Mongo ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Update Company
exports.validateUpdateCompany = [
  body("name")
    .optional()
    .isString()
    .withMessage("Company name must be a string"),

  body("shortName")
    .optional()
    .isString()
    .withMessage("Short name must be a string"),

  body("compLogo").optional().isString().withMessage("Logo must be a string"),

  body("isDelete")
    .optional()
    .isIn([0, 1])
    .withMessage("isDelete must be 0 or 1"),

  body("deletedBy")
    .optional()
    .isMongoId()
    .withMessage("deletedBy must be a valid Mongo ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Get Company by ID
exports.validateGetOneCompany = [
  param("id").isMongoId().withMessage("Invalid company ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Delete Company
exports.validateDeleteCompany = [
  param("id").isMongoId().withMessage("Invalid company ID"),

  body("deletedBy")
    .optional()
    .isMongoId()
    .withMessage("deletedBy must be a valid Mongo ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
