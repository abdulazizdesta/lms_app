const UserModel = require("../models/user");
const cache = require("../config/cache");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const CACHE_KEY = "all_users"
const CACHE_KEY_ENROLLMENT_COUNT = "enrollment_count_per_user"
const CACHE_KEY_INSTRUCTOR_COURSE_COUNT = "instructor_course_count" 

const UserController = {
  getAll: async (_req, res, next) => {
    try {
      const cachedUsers = cache.get(CACHE_KEY);
      if (cachedUsers) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfully get all users",
          data: cachedUsers,
        });
      }

      const users = await UserModel.findAll();
      cache.set(CACHE_KEY, users);
      res.json({
        code: 200,
        source: "database",
        message: "Succesfully get all users",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cacheKey = `user_${id}`;
      const cachedUser = cache.get(cacheKey);
      if (cachedUser) {
        return res.json({
          code: 200,
          source: "cache",
          message: `Succesfully get user with id ${id}`,
          data: cachedUser,
        });
      }

      const users = await UserModel.findById(id);
      if (!users){
        throw new AppError(`User with id ${id} is not found`, 404);
      }      
      cache.set(cacheKey, users);
      res.json({
        code: 200,
        source: "database",
        message: `Succesfully get user with id ${id}`,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { name, email, password, role } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);

      const data = {
        name: name,
        email: email,
        password: hashPassword,
        role: role
      };

      const users = await UserModel.store(data);

      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT); 

      res.status(201).json({
        message: "Succes add new user",
        data: {
          id: users.insertId,
          name: data.name,
          email: data.email,
          role: data.role
        },
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) { 
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { name, email, role } = req.body;

      const oldUser = await UserModel.findById(id);

      if (!oldUser){
        throw new AppError(`User with id ${id} is not found`, 404);
      }

      const data = {
        name: name ? name : oldUser.name,
        email: email ? email : oldUser.email,
        role: role ? role : oldUser.role
      };

      const user = await UserModel.update(id, data);

      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);
      cache.del(`user_${id}`);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldName: oldUser.name,
          name: data.name,
          email: data.email,
          role: data.role
        },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const oldUser = await UserModel.findById(id);

      if (!oldUser){
        throw new AppError(`User with id ${id} is not found`, 404);
      }

      const user = await UserModel.delete(id);

      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);
      cache.del(`user_${id}`);

      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
        user: oldUser
      });
    } catch (error) {
      next(error);
    }
  },

  getEnrollmentsCount: async (_req, res, next) => {
    try {
      const cachedCount = cache.get(CACHE_KEY_ENROLLMENT_COUNT);
      if (cachedCount) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfully get enrollment count per user",
          data: cachedCount,
        });
      }

      const countEnrollments = await UserModel.getEnrollmentsCount();
      cache.set(CACHE_KEY_ENROLLMENT_COUNT, countEnrollments);

      res.status(200).json({
        message: "Succesfully get enrollment count per user",
        source: "database",
        data: countEnrollments,
      });
    } catch (error) {
      next(error);
    }
  },

  getInstructorCourseCount: async (_req, res, next) => {
    try {
      const cachedCount = cache.get(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);
      if (cachedCount) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfully get instructor course count",
          data: cachedCount,
        });
      }
      const data = await UserModel.getInstructorCourseCount()
      cache.set(CACHE_KEY_INSTRUCTOR_COURSE_COUNT, data)
      res.json({
        code: 200,
        source: "database",
        message: "Successfully get instructor course count",
        data: data,
      })
    } catch (error) {
      next(error)
    }
  }
};

module.exports = UserController;
