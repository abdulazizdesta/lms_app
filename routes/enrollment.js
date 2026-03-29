const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment');

router.get('/', EnrollmentController.getAll);
router.get('/detail', EnrollmentController.getDetail);
router.get('/:id', EnrollmentController.getById);
router.post('/', EnrollmentController.store);
router.put('/:id', EnrollmentController.update);
router.delete('/:id', EnrollmentController.delete);

module.exports = router;