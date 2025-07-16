import express from 'express';
import School from '../models/School.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

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
