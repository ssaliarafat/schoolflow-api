const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers');

router.get('/', teachersController.getAllTeachers);
router.get('/:id', teachersController.getTeacher);
router.post('/', teachersController.createTeacher);
router.put('/:id', teachersController.updateTeacher);
router.delete('/:id', teachersController.deleteTeacher);

module.exports = router;