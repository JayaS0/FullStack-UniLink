import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Resource from '../models/Resource.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = './uploads/resources';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper: check if faculty has access to program
const facultyCanAccessProgram = (user, program) => {
  if (user.role === 'faculty' && !user.programs.includes(program)) {
    return false;
  }
  return true;
};

// POST /api/resources - Upload multiple files (Drive-style)
router.post('/', verifyToken, upload.array('files', 20), async (req, res) => {
  const user = req.user;

  const body = {};
  for (const key in req.body) {
    body[key.trim()] = req.body[key];
  }

  const { title, description, type, program, semester, relatedCourse } = body;

  if (!title || !type || !program) {
    return res.status(400).json({ message: 'Title, type, and program are required' });
  }

  if (!facultyCanAccessProgram(user, program)) {
    return res.status(403).json({ message: 'Faculty cannot upload to this program' });
  }
  if (user.role === 'student' && (user.program !== program || user.semester !== semester)) {
    return res.status(403).json({ message: 'Students can upload only to their program and semester' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one file must be uploaded' });
  }

  try {
    const fileUrls = req.files.map(file => `/uploads/resources/${file.filename}`);

    const resource = new Resource({
      title,
      description,
      type,
      fileUrls,
      program,
      semester,
      relatedCourse,
      uploadedBy: user.id,   // Use user.id from token
    });

    await resource.save();

    res.status(201).json({ message: 'Resource uploaded', resource });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/resources/:program - Get all resources by program
router.get('/:program', verifyToken, async (req, res) => {
  const user = req.user;
  const { program } = req.params;

  if (!facultyCanAccessProgram(user, program) && user.role !== 'admin' && (user.role !== 'student' || user.program !== program)) {
    return res.status(403).json({ message: 'Access denied to this program' });
  }

  try {
    const resources = await Resource.find({ program })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'username role');
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/resources/:id - Update a resource
router.put('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { title, description, type, program, semester, relatedCourse } = req.body;

  try {
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (!resource.uploadedBy) {
      return res.status(400).json({ message: 'Resource uploadedBy field is missing' });
    }
    if (!user.id) {
      return res.status(400).json({ message: 'User ID missing in token' });
    }

    // Permission checks
    if (user.role === 'admin') {
      // Admin can update any resource
    } else if (user.role === 'faculty' || user.role === 'student') {
      if (resource.uploadedBy.toString() !== user.id) {
        return res.status(403).json({ message: 'You can only update your own resources' });
      }
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields if provided
    if (title !== undefined) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (type !== undefined) resource.type = type;
    if (program !== undefined) resource.program = program;
    if (semester !== undefined) resource.semester = semester;
    if (relatedCourse !== undefined) resource.relatedCourse = relatedCourse;

    await resource.save();

    res.json({ message: 'Resource updated', resource });

  } catch (error) {
    console.error('PUT /api/resources/:id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/resources/:id - Delete resource (faculty/student can delete their own)
router.delete('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (!resource.uploadedBy) {
      return res.status(400).json({ message: 'Resource uploadedBy is missing' });
    }
    const userId = user.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID missing from token' });
    }

    if (resource.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own resources' });
    }

    if (user.role === 'faculty') {
      if (!user.programs.includes(resource.program)) {
        return res.status(403).json({ message: 'You do not have permission for this program' });
      }
    }

    if (user.role === 'student') {
      if (user.program !== resource.program) {
        return res.status(403).json({ message: 'You do not have permission for this program' });
      }
    }

    // Delete files from disk if they exist
    if (resource.fileUrls?.length) {
      for (const fileUrl of resource.fileUrls) {
        if (fileUrl.startsWith('/uploads/resources')) {
          const filePath = `.${fileUrl}`;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
