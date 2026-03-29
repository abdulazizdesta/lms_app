const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course');

router.get('/', CourseController.getAll);
router.get('/students-count', CourseController.getStudentsCount);
router.get('/show-category', CourseController.showCategoryName);
router.get('/:id', CourseController.getById);
router.post('/', CourseController.store);
router.put('/:id', CourseController.update);
router.delete('/:id', CourseController.delete);

module.exports = router;