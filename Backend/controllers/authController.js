import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Program from "../models/Program.js";
import Course from "../models/Course.js";

// export const signup = async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       password,
//       role,
//       program,
//       semester,
//       programs,
//       courses,
//     } = req.body;

//     const allowedEmailDomains = ["ku.edu.np", "kusom.edu.np"];
//     const emailDomain = email.split("@")[1];

//     if (!allowedEmailDomains.includes(emailDomain)) {
//       return res
//         .status(400)
//         .json({ message: "Email must be a valid university email" });
//     }

//     // ✅ Now allowing admin signup for testing
//     if (!["student", "faculty"].includes(role)) {
//       return res.status(400).json({ message: "Role must be student, faculty" });
//     }
//     //signup for student
//     if (role === "student" && (!program || !semester)) {
//       return res
//         .status(400)
//         .json({ message: "Program and semester required for students" });
//     }

//     if (role === "faculty") {
//       if (!programs || !Array.isArray(programs) || programs.length === 0) {
//         return res
//           .status(400)
//           .json({
//             message: "At least one program must be assigned for faculty",
//           });
//       }
//       if (!courses || !Array.isArray(courses) || courses.length === 0) {
//         return res
//           .status(400)
//           .json({
//             message: "At least one course must be assigned for faculty",
//           });
//       }
//     }
//     let programIds = [];
//     console.log("programs:", programs);
//     if (role === "faculty") {
//       programIds = await Program.find({ name: { $in: programs } }).select("_id");
//       console.log("programIds:", programIds);
//       if (!programIds.length)
//         return res.status(400).json({ message: "Programs not found" });
//     }

//     let courseIds = [];
//     console.log("courses:", courses);
//     if (role === "faculty") {
//       courseIds = await Course.find({ courseCode: { $in: courses } }).select("_id");
//       console.log("courseIds:", courseIds);
//       if (!courseIds.length)
//         return res.status(400).json({ message: "Courses not found" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       program: role === "student" ? program : undefined,
//       semester: role === "student" ? semester : undefined,
//       programs: role === "faculty" ? programs : [],
//       courses: role === "faculty" ? courses : [],
//       verified: true,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Signup error" });
//   }
// };


export const signup = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      role, 
      program, 
      semester, 
      programs, 
      courses 
    } = req.body;

    const allowedEmailDomains = ["ku.edu.np", "kusom.edu.np"];
    const emailDomain = email.split("@")[1];

    if (!allowedEmailDomains.includes(emailDomain)) {
      return res.status(400).json({ message: "Email must be a valid university email" });
    }

    if (!["student", "faculty"].includes(role)) {
      return res.status(400).json({ message: "Role must be student or faculty" });
    }

    if (role === "student" && (!program || !semester)) {
      return res.status(400).json({ message: "Program and semester required for students" });
    }

    if (role === "faculty") {
      if (!programs || !Array.isArray(programs) || programs.length === 0) {
        return res.status(400).json({ message: "At least one program must be assigned for faculty" });
      }
      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ message: "At least one course must be assigned for faculty" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Get ObjectIds for programs and courses
    let programObjectIds = [];
    if (role === "faculty") {
      const programDocs = await Program.find({ name: { $in: programs.map(p => p.trim()) } }).select("_id");
      if (!programDocs.length) {
        return res.status(400).json({ message: "Programs not found" });
      }
      programObjectIds = programDocs.map(p => p._id);
    }

    let courseObjectIds = [];
    if (role === "faculty") {
      const courseDocs = await Course.find({ courseCode: { $in: courses.map(c => c.trim()) } }).select("_id");
      if (!courseDocs.length) {
        return res.status(400).json({ message: "Courses not found" });
      }
      courseObjectIds = courseDocs.map(c => c._id);
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      program: role === "student" ? program : undefined,
      semester: role === "student" ? semester : undefined,
      programs: role === "faculty" ? programObjectIds : [],
      courses: role === "faculty" ? courseObjectIds : [],
      verified: true,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup error", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     role: user.role,
    //     program: user.program,
    //     semester: user.semester,
    //     programs: user.programs,
    //     courses: user.courses,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1d' }
    // );

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        semester: user.semester,
        programs:
          user.role === "student"
            ? [user.program.toString()]
            : user.programs.map((p) => p._id.toString()),
        courses: user.courses,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

