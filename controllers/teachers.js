const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const isValidTeacher = (teacher) => {
    const requiredFields = [
        'firstName',
        'lastName',
        'teacherId',
        'email'
    ];

    for (const field of requiredFields) {
        if (
            typeof teacher[field] !== 'string' ||
            !teacher[field].trim()
        ) {
            return false;
        }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
        return false;
    }

    const optionalFields = [
        'phone',
        'subject',
        'classId',
        'hireDate'
    ];

    for (const field of optionalFields) {
        if (
            teacher[field] !== undefined &&
            typeof teacher[field] !== 'string'
        ) {
            return false;
        }
    }

    return true;
};

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

        if (!isValidTeacher(req.body)) {
            return res.status(400).json({
                error: 'Valid firstName, lastName, teacherId, and email are required. Optional fields must be strings.'
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
            return res.status(400).json({
                error: 'Invalid teacher ID.'
            });
        }

        if (!isValidTeacher(req.body)) {
            return res.status(400).json({
                error: 'Valid firstName, lastName, teacherId, and email are required. Optional fields must be strings.'
            });
        }

        const teacher = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            teacherId: req.body.teacherId,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            classId: req.body.classId,
            hireDate: req.body.hireDate
        };

        const result = await getDb().collection('teachers').replaceOne(
            { _id: new ObjectId(req.params.id) },
            teacher
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Teacher not found.'
            });
        }

        res.status(200).json({
            message: 'Teacher updated successfully.'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update teacher.'
        });
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
