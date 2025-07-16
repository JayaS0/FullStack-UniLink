import express from 'express';
import Course from '../models/Course.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new course (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { courseCode, courseName, description, semester } = req.body;

  if (!courseCode || !courseName) {
    return res.status(400).json({ message: 'Course code and name are required' });
  }

  try {
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    const course = new Course({ courseCode, courseName, description, semester });
    await course.save();
    res.status(201).json({ message: 'Course created', course });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all courses (any logged-in user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseCode: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course by ID (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { courseCode, courseName, description, semester } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (courseCode) course.courseCode = courseCode;
    if (courseName) course.courseName = courseName;
    if (description) course.description = description;
    if (semester !== undefined) course.semester = semester;

    await course.save();
    res.json({ message: 'Course updated', course });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course by ID (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    await course.deleteOne();
    res.json({ message: 'Course deleted' });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
