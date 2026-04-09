const EnrollmentModel = require("../models/enrollment");
const UserModel = require("../models/user");
const CourseModel = require("../models/course");
const redis = require("../config/redis");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const cache = require("../config/cache");

const REDIS_KEY = "all_enrollments";
const REDIS_KEY_DETAIL = "enrollment_details";
const CACHE_KEY_ENROLLMENT_COUNT = "enrollment_count_per_user";

const EnrollmentController = {
  getAll: async (_req, res, next) => {
    try {
      const cachedEnrollments = await redis.get(REDIS_KEY);
      if (cachedEnrollments) {
        return res.status(200).json({
          message: "Succesfully get all enrollments",
          source: "redis cache",
          data: JSON.parse(cachedEnrollments),
        });
      }

      const enrollments = await EnrollmentModel.findAll();
      await redis.set(REDIS_KEY, JSON.stringify(enrollments), { EX: 60 });
      res.status(200).json({
        message: "Succesfully get all enrollments",
        source: "database",
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const redisKey = `enrollment_${id}`;
      const cachedEnrollment = await redis.get(redisKey);
      if (cachedEnrollment) {
        return res.status(200).json({
          message: `Succesfully get enrollment with id ${id}`,
          source: "redis cache",
          data: JSON.parse(cachedEnrollment),
        });
      }

      const enrollment = await EnrollmentModel.findById(id);
      if (!enrollment) {
        throw new AppError(`Enrollment with id ${id} is not found`, 404);
      }
      await redis.set(redisKey, JSON.stringify(enrollment), { EX: 60 });
      res.status(200).json({
        message: `Succesfully get enrollment with id ${id}`,
        source: "database",
        data: enrollment,
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
      const { user_id, course_id } = req.body;
      const data = { user_id, course_id };
      const user = await UserModel.findById(user_id);
      if (!user) {
        throw new AppError("User not found", 404);
      }
      if (user.role !== "student") {
        throw new AppError("Only students can enroll in a course", 400);
      }
      const course = await CourseModel.findById(course_id);
      if (!course) {
        throw new AppError("Course not found", 404);
      }
      const enrollment = await EnrollmentModel.store(data);

      await redis.del(REDIS_KEY);
      await redis.del(REDIS_KEY_DETAIL);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);

      res.status(201).json({
        message: "successfully create enrollment",
        data: { id: enrollment.insertId, ...data },
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

      const oldEnrollment = await EnrollmentModel.findById(id);
      if (!oldEnrollment) {
        throw new AppError(`Enrollment with id ${id} is not found`, 404);
      }

      const { user_id, course_id } = req.body;
      if (user_id) {
        const user = await UserModel.findById(user_id);
        if (!user) {
          throw new AppError("User not found", 404);
        }
        if (user.role !== "student") {
          throw new AppError("Only students can enroll in a course", 400);
        }
      }

      if (course_id) {
        const course = await CourseModel.findById(course_id);
        if (!course) throw new AppError("Course not found", 404);
      }

      const data = {
        user_id: user_id ? user_id : oldEnrollment.user_id,
        course_id: course_id ? course_id : oldEnrollment.course_id,
      };

      await EnrollmentModel.update(id, data);
      await redis.del(REDIS_KEY);
      await redis.del(REDIS_KEY_DETAIL);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);

      res.status(200).json({
        message: `Successfully update enrollment with id ${id}`,
        data: { id, ...data },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const oldEnrollment = await EnrollmentModel.findById(id);
      if (!oldEnrollment) {
        throw new AppError(`Enrollment with id ${id} is not found`, 404);
      }
      await redis.del(REDIS_KEY);
      await redis.del(REDIS_KEY_DETAIL);
      cache.del(CACHE_KEY_ENROLLMENT_COUNT);

      await EnrollmentModel.delete(id);
      res
        .status(200)
        .json({ message: `Successfully deleted enrollment with id ${id}` });
    } catch (error) {
      next(error);
    }
  },

  getDetail: async (_req, res, next) => {
    try {
      const cachedDetails = await redis.get(REDIS_KEY_DETAIL);
      if (cachedDetails) {
        return res.status(200).json({
          message: "Successfully get enrollment details",
          source: "redis cache",
          data: JSON.parse(cachedDetails),
        });
      }
      const enrollments = await EnrollmentModel.getDetail();
      await redis.set(REDIS_KEY_DETAIL, JSON.stringify(enrollments), {
        EX: 60,
      });

      res.status(200).json({
        message: "Successfully get enrollment details",
        source: "database",
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = EnrollmentController;
