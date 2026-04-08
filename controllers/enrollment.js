const EnrollmentModel = require("../models/enrollment");
const redis = require("../config/redisClient");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");

const REDIS_KEY = "all_enrollments";
const REDIS_KEY_DETAIL = "enrollment_details";
const EnrollmentController = {
  getAll: async (req, res, next) => {
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
      if (!enrollment){
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
      const enrollment = await EnrollmentModel.store(data);

      cache.del(REDIS_KEY);
      cache.del(REDIS_KEY_DETAIL);

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
      const { user_id, course_id } = req.body;

      const oldEnrollment = await EnrollmentModel.findById(id);
      if (!oldEnrollment){
        throw new AppError(`Enrollment with id ${id} is not found`, 404);
      }

      const data = {
        user_id: user_id ? user_id : oldEnrollment.user_id,
        course_id: course_id ? course_id : oldEnrollment.course_id,
      };

      await EnrollmentModel.update(id, data);
      cache.del(REDIS_KEY);
      cache.del(REDIS_KEY_DETAIL);

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
      if (!oldEnrollment){
        throw new AppError(`Enrollment with id ${id} is not found`, 404);
      }
      cache.del(REDIS_KEY);
      cache.del(REDIS_KEY_DETAIL);

      await EnrollmentModel.delete(id);
      res.status(200).json({ message: `Successfully deleted enrollment with id ${id}` });
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
      await redis.set(REDIS_KEY_DETAIL, JSON.stringify(enrollments), { EX: 60 });
      
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
