const { body } = require("express-validator");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const validateLogin = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const validateToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token not found", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports =  {validateRegistration, validateLogin, validateToken}