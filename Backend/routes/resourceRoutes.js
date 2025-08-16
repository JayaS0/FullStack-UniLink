import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Resource from '../models/Resource.js';
import { verifyAdmin, verifyStudent, verifyToken } from '../middleware/authMiddleware.js';

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

/**
 * @openapi
 * /api/resources:
 *   post:
 *     tags: [Resources]
 *     summary: Upload multiple resource files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               program:
 *                 type: string
 *               semester:
 *                 type: string
 *               relatedCourse:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Resource uploaded
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
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
  // console.log('User program:', user.programs[0]);
  // console.log('Request program:', program);
  if (user.role === 'student') {
  const userProgram = user.programs[0]?.toString();
  const reqProgram = program.toString();

  const userSemester = String(user.semester);
  const reqSemester = String(semester);

  if (userProgram !== reqProgram || userSemester !== reqSemester) {
    return res.status(403).json({ message: 'Students can upload only to their program and semester' });
  }
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


/**
 * @openapi
 * /api/resources/{program}:
 *   get:
 *     tags: [Resources]
 *     summary: Get all resources by program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: program
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of resources
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
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


/**
 * @openapi
 * /api/resources/{id}:
 *   put:
 *     tags: [Resources]
 *     summary: Update a resource by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Resource updated
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
// PUT /api/resources/:id - Update a resource (resource id)
router.put('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { title, description, type, program, semester, relatedCourse } = req.body;
  // console.log(title)

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

/**
 * @openapi
 * /api/resources/{id}:
 *   delete:
 *     tags: [Resources]
 *     summary: Delete a resource by ID
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
 *         description: Resource deleted successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
// DELETE /api/resources/:id - Delete resource
router.delete('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.uploadedBy) {
      return res.status(400).json({ message: 'Resource uploadedBy is missing' });
    }

    // ADMIN CAN DELETE ANY RESOURCE
    if (user.role !== 'admin') {
      const userId = user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID missing from token' });
      }

      // Must be the uploader
      if (resource.uploadedBy.toString() !== userId) {
        return res.status(403).json({ message: 'You can only delete resources you uploaded' });
      }

      // Extra program-based checks if needed
      if (user.role === 'faculty') {
        if (!user.programs.includes(resource.program.toString())) {
          return res.status(403).json({ message: 'You do not have permission for this program as a faculty' });
        }
      }

      if (user.role === 'student') {
        const userProgram = user.programs[0]?.toString();
        if (userProgram !== resource.program.toString()) {
          return res.status(403).json({ message: 'You do not have permission for this program as a student' });
        }
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
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
