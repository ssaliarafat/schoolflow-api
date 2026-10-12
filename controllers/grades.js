
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllGrades = async (req, res) => {
    try {
        const db = getDb();
        const grades = await db.collection('grades').find().toArray();

        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve grades.' });
    }
};

const getGrade = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid grade ID.' });
        }

        const grade = await getDb().collection('grades').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!grade) {
            return res.status(404).json({ error: 'Grade not found.' });
        }

        res.status(200).json(grade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve grade.' });
    }
};

const createGrade = async (req, res) => {
    try {
        const {
            studentId,
            teacherId,
            classId,
            subject,
            score,
            maxScore,
            term,
            academicYear
        } = req.body;

        if (
            typeof studentId !== 'string' || !studentId.trim() ||
            typeof teacherId !== 'string' || !teacherId.trim() ||
            typeof classId !== 'string' || !classId.trim() ||
            typeof subject !== 'string' || !subject.trim() ||
            typeof term !== 'string' || !term.trim() ||
            typeof academicYear !== 'string' || !academicYear.trim() ||
            typeof score !== 'number' || !Number.isFinite(score) ||
            typeof maxScore !== 'number' || !Number.isFinite(maxScore) ||
            maxScore <= 0 ||
            score < 0 ||
            score > maxScore
        ) {
            return res.status(400).json({
                error: 'Provide valid studentId, teacherId, classId, subject, term, academicYear, score, and maxScore. Score must be between 0 and maxScore.'
            });
        }

        const newGrade = {
            studentId: studentId.trim(),
            teacherId: teacherId.trim(),
            classId: classId.trim(),
            subject: subject.trim(),
            score,
            maxScore,
            term: term.trim(),
            academicYear: academicYear.trim()
        };

        const result = await getDb().collection('grades').insertOne(newGrade);

        res.status(201).json({
            message: 'Grade created successfully.',
            gradeId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create grade.' });
    }
};

const updateGrade = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid grade ID.' });
        }

        const {
            studentId,
            teacherId,
            classId,
            subject,
            score,
            maxScore,
            term,
            academicYear
        } = req.body;

        if (
            typeof studentId !== 'string' || !studentId.trim() ||
            typeof teacherId !== 'string' || !teacherId.trim() ||
            typeof classId !== 'string' || !classId.trim() ||
            typeof subject !== 'string' || !subject.trim() ||
            typeof term !== 'string' || !term.trim() ||
            typeof academicYear !== 'string' || !academicYear.trim() ||
            typeof score !== 'number' || !Number.isFinite(score) ||
            typeof maxScore !== 'number' || !Number.isFinite(maxScore) ||
            maxScore <= 0 ||
            score < 0 ||
            score > maxScore
        ) {
            return res.status(400).json({
                error: 'Provide valid studentId, teacherId, classId, subject, term, academicYear, score, and maxScore. Score must be between 0 and maxScore.'
            });
        }

        const grade = {
            studentId: studentId.trim(),
            teacherId: teacherId.trim(),
            classId: classId.trim(),
            subject: subject.trim(),
            score,
            maxScore,
            term: term.trim(),
            academicYear: academicYear.trim()
        };

        const result = await getDb().collection('grades').replaceOne(
            { _id: new ObjectId(req.params.id) },
            grade
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Grade not found.' });
        }

        res.status(200).json({ message: 'Grade updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update grade.' });
    }
};

const deleteGrade = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid grade ID.' });
        }

        const result = await getDb().collection('grades').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Grade not found.' });
        }

        res.status(200).json({ message: 'Grade deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete grade.' });
    }
};

module.exports = {
    getAllGrades,
    getGrade,
    createGrade,
    updateGrade,
    deleteGrade
};
