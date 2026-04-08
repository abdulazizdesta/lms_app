const { body } = require("express-validator");

const validateUser = [
    body("name").notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").notEmpty().withMessage("Role is required").isIn(["instructor", "student"]).withMessage("Role must be either instructor or student")
]

const validateUserUpdate = [
  body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("role").optional().isIn(["instructor", "student"]).withMessage("Role must be instructor or student")
]

module.exports = { validateUser, validateUserUpdate }