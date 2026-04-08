const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category');
const validateAuth = require("../middleware/validateAuth");
const { validateCategory } = require('../middleware/validateCategory');

router.get('/', CategoryController.getAll);
router.get('/course-count', CategoryController.getCoursesCount);
router.get('/:id', CategoryController.getById);
router.post('/', validateAuth.validateToken, validateCategory, CategoryController.store);
router.put('/:id', validateAuth.validateToken, validateCategory, CategoryController.update);
router.delete('/:id', validateAuth.validateToken, validateCategory, CategoryController.delete);

module.exports = router;