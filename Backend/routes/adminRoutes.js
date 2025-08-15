import express from 'express';
import User from '../models/User.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

//get all users (admin only)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (admin only)

router.get('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  update user details
router.put('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { username, email, role, program, semester, programs, courses, verified } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (program) user.program = program;
    if (semester) user.semester = semester;
    if (programs) user.programs = programs;
    if (courses) user.courses = courses;
    if (verified !== undefined) user.verified = verified;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  reset password
router.post('/users/:id/reset-password', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // hash it if you have hashing logic
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Admin reset password error:', error);
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
