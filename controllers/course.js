const CourseModel = require("../models/course");
const CategoryModel = require("../models/category");
const UserModel = require("../models/user");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const cache = require("../config/cache");

const CACHE_KEY = "all_courses"
const CACHE_KEY_REGIS_COUNT = "students_count"
const CACHE_KEY_CATEGORY = "courses_with_category"
const CACHE_KEY_INSTRUCTOR_COURSE_COUNT = "instructor_course_count" 

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
        source: "database",
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
      const cacheKey = `course_${id}`;
      const cached = cache.get(cacheKey)
      if(cached){
        return res.json({
          source: "cache",
          message: `Succesfully get course with id  ${id}`,
          data: cached,
        })
      }
      const course = await CourseModel.findById(id);
      if (!course)
        throw new AppError(`Course with id ${id} is not found`, 404);
      cache.set(cacheKey, course)
      res.json({
        code: 200,
        source: "database",
        message: `Succesfully get course with id ${id}`,
        data: course,
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
      cache.del(CACHE_KEY_CATEGORY);
      cache.del(CACHE_KEY_REGIS_COUNT);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);

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
      cache.del(CACHE_KEY_CATEGORY);
      cache.del(CACHE_KEY_REGIS_COUNT);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);
      cache.del(`course_${id}`)

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
      cache.del(`course_${id}`)
      cache.del(CACHE_KEY_REGIS_COUNT);
      cache.del(CACHE_KEY_CATEGORY);
      cache.del(CACHE_KEY_INSTRUCTOR_COURSE_COUNT);

      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
        course: oldCourse,
      });
    } catch (error) {
      next(error);
    }
  },

  getRegistrant: async (_req, res, next) => {
    try {
      const cached = cache.get(CACHE_KEY_REGIS_COUNT)
      if (cached) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfuly get total registrant per course",
          data: cached,
        })
      }

      const countRegistrant = await CourseModel.getStudentsCount()
      cache.set(CACHE_KEY_REGIS_COUNT, countRegistrant)
      
      res.status(200).json({
        code: 200,
        source: "database",
        message: "Succesfuly get total registrant per course",
        data: countRegistrant,
      })
    } catch (error) {
      next(error)
    }
  },

  showCategoryName: async (_req, res, next) => {
    try {
      const cached = cache.get(CACHE_KEY_CATEGORY)
      if (cached) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfuly get category",
          data: cached,
        })
      }
      const showCategory = await CourseModel.showCategoryName();
      cache.set(CACHE_KEY_CATEGORY, showCategory)

      res.status(200).json({
        code: 200,
        source: "database",
        message: "Succesfuly get category",
        data: showCategory,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CourseController;
