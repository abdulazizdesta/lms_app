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
  body("category_id")
  .notEmpty()
  .withMessage("Category is required"),
  body("instructor_id")
  .notEmpty()
  .withMessage("Instructor is required")
];

validateCourseUpdate = [
  body("title")
  .optional()
  .notEmpty()
  .withMessage("Title is required"),
  body("description")
  .optional()
  .notEmpty()
  .withMessage("Description is required"),
  body("price")
  .optional()
  .notEmpty()
  .withMessage("Price is required")
  .isNumeric()
  .withMessage("Price must be a number"),
  body("category_id")
  .optional()
  .notEmpty()
  .withMessage("Category is required"),
  body("instructor_id")
  .optional()
  .notEmpty()
  .withMessage("Instructor is required")
]

module.exports = { validateCourse, validateCourseUpdate };
