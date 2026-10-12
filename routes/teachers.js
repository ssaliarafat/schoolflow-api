const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', teachersController.getAllTeachers);
router.get('/:id', teachersController.getTeacher);
router.post('/', isAuthenticated, teachersController.createTeacher);
router.put('/:id', isAuthenticated, teachersController.updateTeacher);
router.delete('/:id', isAuthenticated, teachersController.deleteTeacher);

module.exports = router;