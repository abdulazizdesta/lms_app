const { body } = require("express-validator");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const validateRegistration = [
  body("name").notEmpty().withMessage("Name is Required"),
  body("email").isemail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required")
    .islength({ min: 8 })
    .withMessage("Password must be at least 8 character"),
];

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token not founr", 401);
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

const validateUpdatePassword = [
    body("email").isEmail().withMessage("Email is required").normalizeEmail(),
    body("password")
    .notEmpty()
    .withMessage()
    .islength(min : 8)
    .withMessage("Password must be at least 8 characters long")
]