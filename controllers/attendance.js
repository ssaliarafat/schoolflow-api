
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllAttendance = async (req, res) => {
    try {
        const records = await getDb()
            .collection('attendance')
            .find()
            .toArray();

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve attendance records.' });
    }
};

const getAttendance = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid attendance ID.' });
        }

        const record = await getDb().collection('attendance').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!record) {
            return res.status(404).json({ error: 'Attendance record not found.' });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve attendance record.' });
    }
};

const validateAttendance = (body) => {
    const { studentId, classId, date, status } = body;

    return (
        typeof studentId === 'string' && studentId.trim() &&
        typeof classId === 'string' && classId.trim() &&
        typeof date === 'string' && !Number.isNaN(Date.parse(date)) &&
        typeof status === 'string' &&
        ['present', 'absent', 'late', 'excused'].includes(status.toLowerCase())
    );
};

const createAttendance = async (req, res) => {
    try {
        if (!validateAttendance(req.body)) {
            return res.status(400).json({
                error: 'Provide studentId, classId, a valid date, and status: present, absent, late, or excused.'
            });
        }

        const { studentId, classId, date, status } = req.body;

        const record = {
            studentId: studentId.trim(),
            classId: classId.trim(),
            date,
            status: status.toLowerCase()
        };

        const result = await getDb().collection('attendance').insertOne(record);

        res.status(201).json({
            message: 'Attendance recorded successfully.',
            attendanceId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record attendance.' });
    }
};

const updateAttendance = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid attendance ID.' });
        }

        if (!validateAttendance(req.body)) {
            return res.status(400).json({
                error: 'Provide studentId, classId, a valid date, and status: present, absent, late, or excused.'
            });
        }

        const { studentId, classId, date, status } = req.body;

        const record = {
            studentId: studentId.trim(),
            classId: classId.trim(),
            date,
            status: status.toLowerCase()
        };

        const result = await getDb().collection('attendance').replaceOne(
            { _id: new ObjectId(req.params.id) },
            record
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Attendance record not found.' });
        }

        res.status(200).json({ message: 'Attendance updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update attendance.' });
    }
};

const deleteAttendance = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid attendance ID.' });
        }

        const result = await getDb().collection('attendance').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Attendance record not found.' });
        }

        res.status(200).json({ message: 'Attendance deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete attendance.' });
    }
};

module.exports = {
    getAllAttendance,
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};
