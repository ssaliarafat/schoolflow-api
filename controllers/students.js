const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllStudents = async (req, res) => {
    try {
        const db = getDb();
        const students = await db.collection('students').find().toArray();

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve students.' });
    }
};

const getStudent = async (req, res) => {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid student ID.' });
        }

        const student = await db.collection('students').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve student.' });
    }
};

const createStudent = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            studentId,
            email,
            dateOfBirth,
            gender,
            classId,
            phone,
            enrollmentDate
        } = req.body;

        if (!firstName || !lastName || !studentId || !email) {
            return res.status(400).json({
                error: 'firstName, lastName, studentId, and email are required.'
            });
        }

        const db = getDb();

        const newStudent = {
            firstName,
            lastName,
            studentId,
            email,
            dateOfBirth,
            gender,
            classId,
            phone,
            enrollmentDate
        };

        const result = await db.collection('students').insertOne(newStudent);

        res.status(201).json({
            message: 'Student created successfully.',
            studentId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create student.' });
    }
};

const updateStudent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid student ID.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'At least one field is required to update the student.'
            });
        }

        const db = getDb();

        const updates = { ...req.body };

        delete updates._id;

        const result = await db.collection('students').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({
            message: 'Student updated successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update student.' });
    }
};

const deleteStudent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid student ID.' });
        }

        const db = getDb();

        const result = await db.collection('students').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json({
            message: 'Student deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student.' });
    }
};

module.exports = {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};

