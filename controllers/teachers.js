const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllTeachers = async (req, res) => {
    try {
        const db = getDb();
        const teachers = await db.collection('teachers').find().toArray();

        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve teachers.' });
    }
};

const getTeacher = async (req, res) => {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid teacher ID.' });
        }

        const teacher = await db.collection('teachers').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve teacher.' });
    }
};

const createTeacher = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            teacherId,
            email,
            phone,
            subject,
            classId,
            hireDate
        } = req.body;

        if (!firstName || !lastName || !teacherId || !email) {
            return res.status(400).json({
                error: 'firstName, lastName, teacherId, and email are required.'
            });
        }

        const db = getDb();

        const newTeacher = {
            firstName,
            lastName,
            teacherId,
            email,
            phone,
            subject,
            classId,
            hireDate
        };

        const result = await db.collection('teachers').insertOne(newTeacher);

        res.status(201).json({
            message: 'Teacher created successfully.',
            teacherId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create teacher.' });
    }
};

const updateTeacher = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid teacher ID.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'At least one field is required to update the teacher.'
            });
        }

        const db = getDb();

        const updates = { ...req.body };

        delete updates._id;

        const result = await db.collection('teachers').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        res.status(200).json({
            message: 'Teacher updated successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update teacher.' });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid teacher ID.' });
        }

        const db = getDb();

        const result = await db.collection('teachers').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Teacher not found.' });
        }

        res.status(200).json({
            message: 'Teacher deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete teacher.' });
    }
};

module.exports = {
    getAllTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
