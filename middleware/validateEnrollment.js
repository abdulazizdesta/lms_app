const { body } = require("express-validator");

const validateEnrollment = [
  body("course_id").notEmpty().withMessage("Course ID is required"),
  body("user_id").notEmpty().withMessage("User ID is required"),
];

const validateEnrollmentUpdate = [
  body("course_id").optional().notEmpty().withMessage("Course ID is required"),
  body("user_id").optional().notEmpty().withMessage("User ID is required"),
];

module.exports = { validateEnrollment, validateEnrollmentUpdate };