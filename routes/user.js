const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const validateAuth = require("../middleware/validateAuth");
const { validateUser, validateUserUpdate } = require('../middleware/validateUser');

router.get('/', UserController.getAll);
router.get('/enrolls-count', UserController.getEnrollmentsCount);
router.get('/instructor-course-count', UserController.getInstructorCourseCount)
router.get('/:id', UserController.getById);
router.post('/', validateAuth.validateToken, validateUser, UserController.store);
router.put('/:id', validateAuth.validateToken, validateUserUpdate, UserController.update);
router.delete('/:id', validateAuth.validateToken, UserController.delete);

module.exports = router;