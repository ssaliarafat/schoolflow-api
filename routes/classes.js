
const express = require('express');
const router = express.Router();

const classesController = require('../controllers/classes');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', classesController.getAllClasses);
router.get('/:id', classesController.getClass);
router.post('/', isAuthenticated, classesController.createClass);
router.put('/:id', isAuthenticated, classesController.updateClass);
router.delete('/:id', classesController.deleteClass);

module.exports = router;
