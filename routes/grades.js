
const express = require('express');
const router = express.Router();

const gradesController = require('../controllers/grades');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', gradesController.getAllGrades);
router.get('/:id', gradesController.getGrade);
router.post('/', isAuthenticated, gradesController.createGrade);
router.put('/:id', isAuthenticated, gradesController.updateGrade);
router.delete('/:id', isAuthenticated, gradesController.deleteGrade);

module.exports = router;
