const { body } = require("express-validator");

const validateCategory = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
];

const validateCategoryUpdate = [
  body("name")
    .optional()
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
];

module.exports = { validateCategory, validateCategoryUpdate }; 