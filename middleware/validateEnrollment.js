const { body } = require("express-validator");

const validateEnrollment = [
  body("course_id").notEmpty().withMessage("Course ID is required"),
  body("user_id").notEmpty().withMessage("User ID is required"),
];

module.exports = { validateEnrollment };