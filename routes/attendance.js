
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendance);

router.post('/', isAuthenticated, attendanceController.createAttendance);
router.put('/:id', isAuthenticated, attendanceController.updateAttendance);
router.delete('/:id', isAuthenticated, attendanceController.deleteAttendance);

module.exports = router;
