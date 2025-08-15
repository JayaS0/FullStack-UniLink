import express from "express";
import Course from "../models/Course.js";
import School from "../models/School.js";
import Program from "../models/Program.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new course (admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const {
    courseCode,
    courseName,
    description,
    semester,
    programName,
    schoolName,
  } = req.body;

  // Validate required fields
  if (!courseCode || !courseName || !semester || !programName || !schoolName) {
    return res
      .status(400)
      .json({
        message:
          "Course code, name, semester, program, and school are required",
      });
  }

  try {
    // 1️⃣ Check if course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    // 2️⃣ Find the school by name
    const schoolDoc = await School.findOne({ name: schoolName });
    if (!schoolDoc) {
      return res.status(404).json({ message: "School not found" });
    }

    // 3️⃣ Find the program by name
    const programDoc = await Program.findOne({ name: programName });
    if (!programDoc) {
      return res.status(404).json({ message: "Program not found" });
    }

    // 4️⃣ Create the course with program and school IDs
    const course = new Course({
      courseCode,
      courseName,
      description,
      semester,
      program: programDoc._id,
      school: schoolDoc._id,
    });

    await course.save();

    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all courses (any logged-in user)
router.get("/", verifyToken, async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseCode: 1 });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single course by course ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update course by ID(admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const {
    courseCode,
    courseName,
    description,
    semester,
    programName,
    schoolName,
  } = req.body;
 
  try {
    const course = await Course.findById(req.params.id);
    // console.log(course);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Update simple fields
    if (courseCode) course.courseCode = courseCode;
    if (courseName) course.courseName = courseName;
    if (description) course.description = description;
    if (semester !== undefined) course.semester = semester;

    console.log("Request body:", req.body);
    console.log("Request params:", req.params);

    // Update program only if provided
    if (programName) {
      const programDoc = await Program.findOne({name:programName});

      console.log("program name ", programDoc);
      if (!programDoc)
        return res.status(404).json({ message: "Program not found" });
      course.program = programDoc._id;
    }

    // Update school only if provided
    if (schoolName) {
      const schoolDoc = await School.findOne({ name: schoolName });
      if (!schoolDoc)
        return res.status(404).json({ message: "School not found" });
      course.school = schoolDoc._id;
    }

    await course.save();
    res.json({ message: "Course updated", course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
});

// Delete course by ID (admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
