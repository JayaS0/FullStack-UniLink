import express from 'express';
import User from '../models/User.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user by ID (admin only)
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Promote students by one semester (optional: by program)
router.post('/promote-semester', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { program } = req.body;

    const filter = { role: 'student' };
    if (program) filter.program = program;

    const students = await User.find(filter);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for promotion' });
    }

    const updatedStudents = [];

    for (let student of students) {
      const currentSem = parseInt(student.semester);
      if (!isNaN(currentSem)) {
        student.semester = (currentSem + 1).toString();
        await student.save();
        updatedStudents.push(student.username);
      }
    }

    res.json({ message: `${updatedStudents.length} students promoted`, promotedStudents: updatedStudents });
  } catch (error) {
    console.error('Error promoting students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
