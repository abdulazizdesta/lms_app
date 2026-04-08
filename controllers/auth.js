require("dotenv").config();
const { validationResult } = require("express-validator");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const authController = {
  registration: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { name, email, password, role } = req.body;

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        throw new AppError("Email already registered", 400);
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const data = {
        name: name,
        email: email,
        password: hashPassword,
        role: role || "student",
      };

      const user = await userModel.registration(data);
      if (user) {
        return res.status(201).json({
          code: 201,
          message: "Successfully registration",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);

      if (!user) {
        throw new AppError("Email or Password is wrong", 401);
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        throw new AppError("Email or Password is wrong", 401);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      );

      res.json({
        code: 200,
        message: "Successfully login",
        data: {
          token: token,
          user: {
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  profile: async (req, res, next) => {
    try{
        return res.json({
            code: 200,
            message: "Succesfully get profile",
            data: {
                user: req.user
            }
        })
    }catch (error){
        next(error)
    }
  }

};

module.exports = authController
