const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment');
const validateAuth = require("../middleware/validateAuth");
const { validateEnrollment } = require('../middleware/validateEnrollment');

router.get('/', EnrollmentController.getAll);
router.get('/detail', EnrollmentController.getDetail);
router.get('/:id', EnrollmentController.getById);
router.post('/', validateAuth.validateToken, validateEnrollment, EnrollmentController.store);
router.put('/:id', validateAuth.validateToken, validateEnrollment, EnrollmentController.update);
router.delete('/:id', validateAuth.validateToken,  EnrollmentController.delete);

module.exports = router;