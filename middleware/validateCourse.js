const { body } = require("express-validator");

const validateCourse = [
  body("title")
  .notEmpty()
  .withMessage("Title is required"),
  body("description")
  .notEmpty()
  .withMessage("Description is required"),
  body("price")
  .notEmpty()
  .withMessage("Price is required")
  .isNumeric()
  .withMessage("Price must be a number"),
  body("instructor_id")
  .notEmpty()
  .withMessage("Instructor is required")
];

module.exports = { validateCourse };
