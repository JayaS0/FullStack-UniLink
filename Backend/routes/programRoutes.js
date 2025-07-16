import express from 'express';
import Program from '../models/Program.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new program
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { programName, semesters } = req.body;

  if (!programName) {
    return res.status(400).json({ message: 'Program name is required' });
  }

  try {
    const program = new Program({ programName, semesters: semesters || [] });
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all programs
router.get('/', verifyToken, async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a semester to a program
router.put('/:id/semester', verifyToken, verifyAdmin, async (req, res) => {
  const { semester } = req.body;
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });

    program.semesters.push(semester);
    await program.save();

    res.json(program);
  } catch (error) {
    console.error('Error adding semester:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a program
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });

    await program.deleteOne();
    res.json({ message: 'Program deleted' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
