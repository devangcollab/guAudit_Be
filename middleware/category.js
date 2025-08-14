const { body, param, validationResult } = require("express-validator");

// 📌 Validate Create Category
exports.validateCreateCategory = [
  body("categoryName")
    .isString()
    .notEmpty()
    .withMessage("Category name is required"),

  body("createdBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid createdBy ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Get One Category by ID
exports.validateGetOneCategory = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Delete Category by ID
exports.validateDeleteCategory = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("deletedBy")
    .optional()
    .isMongoId()
    .withMessage("Invalid deletedBy ID"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// 📌 Validate Update Category
exports.validateUpdateCategory = [
  body("categoryName")
    .optional()
    .isString()
    .withMessage("Category name must be a string"),

  body("isDelete")
    .optional()
    .isIn([0, 1])
    .withMessage("isDelete must be 0 or 1"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
