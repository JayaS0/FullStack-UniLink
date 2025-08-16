import express from 'express';
import { verifyToken, verifyStudent } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';

const router = express.Router();

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review (students only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, facultyId, rating, comment, semester, program]
 *             properties:
 *               courseId:
 *                 type: string
 *               courseName:
 *                 type: string
 *               facultyId:
 *                 type: string
 *               facultyName:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               semester:
 *                 type: integer
 *               program:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
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

  // Safety check: ensure req.user exists
  if (!req.user || !req.user.programs) {
    return res.status(401).json({ message: 'Unauthorized or invalid token payload' });
  }

  // Students can only submit reviews for their assigned program(s) and semester
  if (
    !req.user.programs.includes(program) || // check program array
    req.user.semester !== Number(semester)
  ) {
    return res.status(403).json({ message: 'You can only submit reviews for your own program and semester' });
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
/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews (role-based filtering)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    let reviews;

    if (req.user.role === 'student') {
      // Students see reviews for their own program only, no user details
      reviews = await Review.find({ program: req.user.programs[0]});
      console.log('Student reviews fetched:', reviews);
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
