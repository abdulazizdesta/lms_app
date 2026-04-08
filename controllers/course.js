const CourseModel = require("../models/course");
const CategoryModel = require("../models/category");
const UserModel = require("../models/user");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const cache = require("../config/cache");

const CACHE_KEY = "all_courses";
const CourseController = {
  getAll: async (_req, res, next) => {
    try {
      const cached = cache.get(CACHE_KEY);
      if (cached) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfully get all courses",
          data: cached,
        });
      }
      const courses = await CourseModel.findAll();
      cache.set(CACHE_KEY, courses);
      res.json({
        code: 200,
        message: "Succesfully get all courses",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const courses = await CourseModel.findById(id);
      if (!courses)
        throw new AppError(`Data with id ${id} is not found`, 404);
      res.json({
        code: 200,
        message: `Succesfully get data with id ${id}`,
        data: courses,
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

      const { title, description, price, category_id, instructor_id } =
        req.body;

      const findCategory = await CategoryModel.findById(category_id);
      if (!findCategory) {
        throw new AppError("Category not found", 404);
      }

      const instructor = await UserModel.findById(instructor_id);
      if (!instructor) {
        throw new AppError("Instructor not found", 404);
      }
      const data = {
        title: title,
        description: description,
        price: price,
        category_id: category_id,
        instructor_id: instructor_id,
      };

      const courses = await CourseModel.store(data);

      cache.del(CACHE_KEY);

      res.status(201).json({
        message: "Succesfully created data",
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          instructor_id: data.instructor_id,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, price, category_id, instructor_id } =
        req.body;

      const oldCourse = await CourseModel.findById(id);

      if (!oldCourse) throw new AppError(`Data with ${id} is not found`, 404);

      const data = {
        title: title ? title : oldCourse.title,
        description: description ? description : oldCourse.description,
        price: price ? price : oldCourse.price,
        category_id: category_id ? category_id : oldCourse.category_id,
        instructor_id: instructor_id ? instructor_id : oldCourse.instructor_id,
      };

      await CourseModel.update(id, data);

      cache.del(CACHE_KEY);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldTitle: oldCourse.title,
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          instructor_id: data.instructor_id,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const oldCourse = await CourseModel.findById(id);

      if (!oldCourse) throw new AppError(`Data with ${id} is not found`, 404);

      await CourseModel.delete(id);

      cache.del(CACHE_KEY);

      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
        course: oldCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  getStudentsCount: async (_req, res, next) => {
    try {
      const countStudents = await CourseModel.getStudentsCount();
      res.status(200).json({
        message: "Sukses tampilkan jumlah Pendaftaran per Course",
        data: countStudents,
      });
    } catch (error) {
      next(error);
    }
  },

  showCategoryName: async (_req, res, next) => {
    try {
      const showCategory = await CourseModel.showCategoryName();
      res.status(200).json({
        message: "Sukses tampilkan Data",
        data: showCategory,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CourseController;
