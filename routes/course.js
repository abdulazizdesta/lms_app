const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course');
const validateAuth = require("../middleware/validateAuth");
const { validateCourse } = require('../middleware/validateCourse');

router.get('/', CourseController.getAll);
router.get('/students-count', CourseController.getStudentsCount);
router.get('/show-category', CourseController.showCategoryName);
router.get('/:id', CourseController.getById);
router.post('/', validateAuth.validateToken, validateCourse, CourseController.store);
router.put('/:id', validateAuth.validateToken, validateCourse, CourseController.update);
router.delete('/:id', validateAuth.validateToken, CourseController.delete);

module.exports = router;