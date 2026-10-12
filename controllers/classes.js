
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllClasses = async (req, res) => {
    try {
        const db = getDb();
        const classes = await db.collection('classes').find().toArray();

        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve classes.' });
    }
};

const getClass = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid class ID.' });
        }

        const classRecord = await getDb().collection('classes').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!classRecord) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json(classRecord);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve class.' });
    }
};

const createClass = async (req, res) => {
    try {
        const {
            className,
            classCode,
            teacherId,
            academicYear,
            room
        } = req.body;

        if (
            typeof className !== 'string' || !className.trim() ||
            typeof classCode !== 'string' || !classCode.trim() ||
            typeof academicYear !== 'string' || !academicYear.trim()
        ) {
            return res.status(400).json({
                error: 'className, classCode, and academicYear are required as non-empty strings.'
            });
        }

        if (
            (teacherId !== undefined && typeof teacherId !== 'string') ||
            (room !== undefined && typeof room !== 'string')
        ) {
            return res.status(400).json({
                error: 'teacherId and room must be strings when provided.'
            });
        }

        const newClass = {
            className: className.trim(),
            classCode: classCode.trim(),
            teacherId,
            academicYear: academicYear.trim(),
            room
        };

        const result = await getDb().collection('classes').insertOne(newClass);

        res.status(201).json({
            message: 'Class created successfully.',
            classId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create class.' });
    }
};

const updateClass = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid class ID.' });
        }

        const {
            className,
            classCode,
            teacherId,
            academicYear,
            room
        } = req.body;

        if (
            typeof className !== 'string' || !className.trim() ||
            typeof classCode !== 'string' || !classCode.trim() ||
            typeof academicYear !== 'string' || !academicYear.trim()
        ) {
            return res.status(400).json({
                error: 'className, classCode, and academicYear are required as non-empty strings.'
            });
        }

        if (
            (teacherId !== undefined && typeof teacherId !== 'string') ||
            (room !== undefined && typeof room !== 'string')
        ) {
            return res.status(400).json({
                error: 'teacherId and room must be strings when provided.'
            });
        }

        const classRecord = {
            className: className.trim(),
            classCode: classCode.trim(),
            teacherId,
            academicYear: academicYear.trim(),
            room
        };

        const result = await getDb().collection('classes').replaceOne(
            { _id: new ObjectId(req.params.id) },
            classRecord
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json({ message: 'Class updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update class.' });
    }
};

const deleteClass = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid class ID.' });
        }

        const result = await getDb().collection('classes').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        res.status(200).json({ message: 'Class deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete class.' });
    }
};

module.exports = {
    getAllClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass
};
