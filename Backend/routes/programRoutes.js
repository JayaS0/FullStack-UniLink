import express from 'express';
import Program from '../models/Program.js';
import School from '../models/School.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


import mongoose from "mongoose";

const db = mongoose.connection;

// db.once("open", async () => {
//   try {
//     // Drop the wrong index
//     await db.collection("programs").dropIndex("programName_1");
//     console.log("Old index dropped successfully.");

//     // Create a new unique index on `name`
//     await db.collection("programs").createIndex({ name: 1 }, { unique: true });
//     console.log("New unique index on `name` created successfully.");
//   } catch (error) {
//     console.error("Error fixing indexes:", error);
//   }
// });


/**
 * @openapi
 * /api/programs:
 *   post:
 *     tags: [Programs]
 *     summary: Create a new program (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               programName:
 *                 type: string
 *               semesters:
 *                 type: array
 *                 items:
 *                   type: integer
 *               schoolName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Program created
 *       400:
 *         description: Validation error
 *       404:
 *         description: School not found
 *       500:
 *         description: Server error
 */
// Create a new program(only admin can create)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { programName, semesters, schoolName } = req.body;
  console.log('programname:', programName, 'for school:', schoolName);
  if (!programName || !schoolName) {
    return res.status(400).json({ message: 'Program name and school are required' });
  }
  console.log("Full request body:", req.body);

  try {
    // 1️⃣ Find the school by name
    const schoolDoc = await School.findOne({ name: schoolName });
    if (!schoolDoc) {
      return res.status(404).json({ message: 'School not found' });
    }

    // 2️⃣ Create the program using the school _id
    const program = new Program({
      name: programName,
      semesters: semesters || [],
      school: schoolDoc._id,
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Error creating program', error });
  }
});


/**
 * @openapi
 * /api/programs:
 *   get:
 *     tags: [Programs]
 *     summary: Get all programs (authenticated)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of programs
 *       500:
 *         description: Server error
 */
// Get all programs (authenticated)
router.get('/', verifyToken, async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: Get all programs (no auth) for signup flows
router.get('/public', async (req, res) => {
  try {
    const programs = await Program.find().select('name semesters');
    res.json(programs);
  } catch (error) {
    console.error('Error fetching public programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/programs/{id}/semester:
 *   put:
 *     tags: [Programs]
 *     summary: Add one or more semesters to a program (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               semester:
 *                 description: Single number or array of numbers
 *     responses:
 *       200:
 *         description: Program updated
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
// Add a semester to a program  (programid)
router.put('/:id/semester', verifyToken, verifyAdmin, async (req, res) => {
  let { semester } = req.body;

  // Make sure it's an array
  if (!Array.isArray(semester)) {
    semester = [semester]; // wrap single number into array
  }

  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });

    // Push each semester number into the semesters array
    semester.forEach((s) => program.semesters.push(Number(s)));

    await program.save();
    res.json(program);
  } catch (error) {
    console.error('Error adding semester:', error);
    res.status(500).json({ message: 'Error adding semester' });
  }
});


/**
 * @openapi
 * /api/programs/{id}:
 *   delete:
 *     tags: [Programs]
 *     summary: Delete a program (admin only)
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
 *         description: Program deleted
 *       404:
 *         description: Program not found
 *       500:
 *         description: Server error
 */
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
