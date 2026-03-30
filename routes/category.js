const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category');

router.get('/', CategoryController.getAll);
router.get('/course-count', CategoryController.getCoursesCount);
router.get('/:id', CategoryController.getById);
router.post('/', CategoryController.store);
router.put('/:id', CategoryController.update);
// router.delete('/:id', CategoryController.delete);

module.exports = router;