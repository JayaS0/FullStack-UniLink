import express from 'express';
import { verifyToken, verifyStudent } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';

const router = express.Router();

// POST review — only students can submit
router.post('/', verifyToken, verifyStudent, async (req, res) => {
  const {
    courseId,
    courseName,
    facultyId,
    facultyName,
    rating,
    comment,
    semester,
    program,
  } = req.body;

  // Basic field validation
  if (!courseId || !facultyId || !rating || !comment || !semester || !program) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Students can only submit reviews for their assigned program and semester
  if (
    req.user.program.toString() !== program ||
    req.user.semester !== Number(semester)
  ) {
    return res.status(403).json({
      message: 'You can only submit reviews for your own program and semester',
    });
  }

  try {
    const newReview = new Review({
      courseId,
      courseName,
      facultyId,
      facultyName,
      rating,
      comment,
      semester,
      program,
      user: req.user.id, // store reviewer ID
    });

    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET reviews — role-based filtering and anonymization
router.get('/', verifyToken, async (req, res) => {
  try {
    let reviews;

    if (req.user.role === 'student') {
      // Students see reviews for their own program only, no user details
      reviews = await Review.find({ program: req.user.program });
    } else if (req.user.role === 'faculty') {
      // Faculty see reviews for their assigned programs and courses only
      reviews = await Review.find({
        program: { $in: req.user.programs },
        courseId: { $in: req.user.courses },
      });
    } else if (req.user.role === 'admin') {
      // Admin sees everything + user details populated
      reviews = await Review.find().populate('user', 'username email program semester');
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
