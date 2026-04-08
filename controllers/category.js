const CategoryModel = require("../models/category");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const cache = require("../config/cache");

const CACHE_KEY = "all_categories"
const CACHE_KEY_COURSE_COUNT = "courses_count_per_category"

const CategoryController = {
  getAll: async (req, res, next) => {
    try {
      const cachedCategories = cache.get(CACHE_KEY);
      if (cachedCategories) {
        return res.json({
          code: 200,
          source: "cache",
          message: "Succesfully get all categories",
          data: cachedCategories,
        });
      }
      
      const categories = await CategoryModel.findAll();
      cache.set(CACHE_KEY, categories);
      res.json({
        code: 200,
        source: "database",
        message: "Succesfully get all categories",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cacheKey = `category_${id}`;
      const cachedCategory = cache.get(cacheKey);
      if (cachedCategory) {
        return res.json({
          code: 200,
          source: "cache",
          message: `Succesfully get category with id ${id}`,
          data: cachedCategory,
        });
      }

      const categories = await CategoryModel.findById(id);
      if (!categories){
        throw new AppError(`Category with id ${id} is not found`, 404);
      }
      cache.set(cacheKey, categories);
      res.json({
        code: 200,
        source: "database",
        message: `Succesfully get category with id ${id}`,
        data: categories,
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

      const { name } = req.body;

      const data = {
        name: name,
      };

      const categories = await CategoryModel.store(data);

      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_COURSE_COUNT);

      res.status(201).json({
        code: 201,
        message: "Succesfully added category",
        data: {
          id: categories.insertId,
          name: data.name,
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
      const { name } = req.body;

      const oldCategory = await CategoryModel.findById(id);

      if (!oldCategory){
        throw new AppError(`Category with id ${id} is not found`, 404);
      }

      const data = {
        name: name ? name : oldCategory.name,
      };

      await CategoryModel.update(id, data);
      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_COURSE_COUNT);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldName: oldCategory.name,
          name: data.name
        },
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const oldCategory = await CategoryModel.findById(id);

      if (!oldCategory){
        throw new AppError(`Category with id ${id} is not found`, 404);
      }

      const category = await CategoryModel.delete(id);
      cache.del(CACHE_KEY);
      cache.del(CACHE_KEY_COURSE_COUNT);
      res.json({
        code: 200,
        message: `Succesfully delete category with id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  },

  getCoursesCount: async (_req, res, next) => {
    try {
      const cachedCount = cache.get(CACHE_KEY_COURSE_COUNT);
      if (cachedCount) {
        return res.status(200).json({
          message: "Succesfully get courses count per category",
          source: "cache",
          data: cachedCount,
        });
       }
      const countCourses = await CategoryModel.getCoursesCount();
      cache.set(CACHE_KEY_COURSE_COUNT, countCourses);
      res.status(200).json({
        source: "database",
        message: "Succesfully get courses count per category",
        data: countCourses,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CategoryController;
