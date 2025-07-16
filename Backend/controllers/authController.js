import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { username, email, password, role, program, semester, programs, courses } = req.body;

    const allowedEmailDomains = ['ku.edu.np', 'kusom.edu.np'];
    const emailDomain = email.split('@')[1];

    if (!allowedEmailDomains.includes(emailDomain)) {
      return res.status(400).json({ message: 'Email must be a valid university email' });
    }

    // ✅ Now allowing admin signup for testing
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({ message: 'Role must be student, faculty' });
    }

    if (role === 'student' && (!program || !semester)) {
      return res.status(400).json({ message: 'Program and semester required for students' });
    }

    if (role === 'faculty') {
      if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({ message: 'At least one program must be assigned for faculty' });
      }
      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ message: 'At least one course must be assigned for faculty' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      program: role === 'student' ? program : undefined,
      semester: role === 'student' ? semester : undefined,
      programs: role === 'faculty' ? programs : [],
      courses: role === 'faculty' ? courses : [],
      verified: true,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        program: user.program,
        semester: user.semester,
        programs: user.programs,
        courses: user.courses,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
