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
