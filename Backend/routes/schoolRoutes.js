import express from 'express';
import School from '../models/School.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/schools:
 *   post:
 *     tags: [Schools]
 *     summary: Create a new school (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: School created
 *       400:
 *         description: Validation error
 *       409:
 *         description: School already exists
 *       500:
 *         description: Server error
 */
// Create a new school (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'School name is required' });
  }

  try {
    const existingSchool = await School.findOne({ name });
    if (existingSchool) {
      return res.status(409).json({ message: 'School already exists' });
    }

    const newSchool = new School({ name, description });
    await newSchool.save();

    res.status(201).json({ message: 'School created', school: newSchool });
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/schools:
 *   get:
 *     tags: [Schools]
 *     summary: Get all schools (authenticated)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools
 *       500:
 *         description: Server error
 */
// Get all schools (Anyone authenticated)
router.get('/', verifyToken, async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/schools/{id}:
 *   delete:
 *     tags: [Schools]
 *     summary: Delete a school (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: School deleted
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
// Delete a school (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json({ message: 'School deleted' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
