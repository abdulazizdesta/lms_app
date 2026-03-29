const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.getAll);
router.get('/enrolls-count', UserController.getEnrollmentsCount);
router.get('/:id', UserController.getById);
router.post('/', UserController.store);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;