const express = require('express');
const router = express.Router();
const { Course, Section, Lesson, Enrollment, Progress, User } = require('../models');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get course details
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: Section,
                    include: [Lesson]
                }
            ]
        });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll in a course (Mocked user ID 1 for now if no auth header)
router.post('/:id/enroll', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // In a real app, userId would come from req.user
        const userId = req.body.userId || 1;

        await Enrollment.findOrCreate({
            where: { UserId: userId, CourseId: course.id }
        });

        res.json({ message: 'Enrolled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update progress
router.post('/progress/mark-complete', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        await Progress.findOrCreate({
            where: { UserId: userId, LessonId: lessonId },
            defaults: { isCompleted: true }
        });
        res.json({ message: 'Progress updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user progress for a course
router.get('/:id/progress/:userId', async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.params.userId;

        const sections = await Section.findAll({
            where: { CourseId: courseId },
            include: [Lesson]
        });

        const lessonIds = sections.flatMap(s => s.Lessons.map(l => l.id));

        const progress = await Progress.findAll({
            where: {
                UserId: userId,
                LessonId: lessonIds
            }
        });

        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
