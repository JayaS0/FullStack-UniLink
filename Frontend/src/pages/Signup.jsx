// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const PROGRAMS = ["Computer Science", "Information Technology", "Electronics", "Mechanical"];
// const SEMESTERS = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"];
// const COURSES = [
//   "Programming 101",
//   "Data Structures",
//   "Algorithms",
//   "Operating Systems",
//   "Database Systems",
//   "Networks",
// ];

// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");

//   const [program, setProgram] = useState("");
//   const [semester, setSemester] = useState("");

//   const [facultyPrograms, setFacultyPrograms] = useState([]);
//   const [facultyCourses, setFacultyCourses] = useState([]);

//   const [showRoleDropdown, setShowRoleDropdown] = useState(false);
//   const [showProgramDropdown, setShowProgramDropdown] = useState(false);
//   const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
//   const [showFacultyProgramDropdown, setShowFacultyProgramDropdown] = useState(false);
//   const [showFacultyCourseDropdown, setShowFacultyCourseDropdown] = useState(false);

//   const navigate = useNavigate();

//   const roleDropdownRef = useRef(null);
//   const programDropdownRef = useRef(null);
//   const semesterDropdownRef = useRef(null);
//   const facultyProgramDropdownRef = useRef(null);
//   const facultyCourseDropdownRef = useRef(null);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)
//       ) setShowRoleDropdown(false);

//       if (
//         programDropdownRef.current && !programDropdownRef.current.contains(event.target)
//       ) setShowProgramDropdown(false);

//       if (
//         semesterDropdownRef.current && !semesterDropdownRef.current.contains(event.target)
//       ) setShowSemesterDropdown(false);

//       if (
//         facultyProgramDropdownRef.current && !facultyProgramDropdownRef.current.contains(event.target)
//       ) setShowFacultyProgramDropdown(false);

//       if (
//         facultyCourseDropdownRef.current && !facultyCourseDropdownRef.current.contains(event.target)
//       ) setShowFacultyCourseDropdown(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleArrayValue = (arr, val) => {
//     return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
//   };

//   const handleSubmit = (e) => {
//   e.preventDefault();
//   if (!email.endsWith("@ku.edu.np") && !email.endsWith("@kusom.edu.np")) {
//     alert("Only KU emails allowed!");
//     return;
//   }
//   if (role === "student" && (!program || !semester)) {
//     alert("Please select a program and semester.");
//     return;
//   }
//   if (role === "faculty" && (facultyPrograms.length === 0 || facultyCourses.length === 0)) {
//     alert("Please select at least one program and one course.");
//     return;
//   }

//   // Save to localStorage for dashboard demo
//   const userData = {
//     username,
//     email,
//     role,
//     program,
//     semester,
//     facultyPrograms,
//     facultyCourses,
//   };
//   localStorage.setItem("currentUser", JSON.stringify(userData));

//   alert(`Signed up successfully as ${role}!`);
//   navigate("/login");
// };

//   const roles = ["student", "faculty"];

//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#D1CFC9", padding: 20 }}>
//       <div style={containerStyle}>
//         <h1 style={titleStyle}>UniLink</h1>
//         <h2 style={subTitleStyle}>Sign Up</h2>

//         <form onSubmit={handleSubmit}>
//           <label style={labelStyle}>Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             style={inputStyle}
//           />

//           <label style={labelStyle}>KU Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={inputStyle}
//           />

//           <label style={labelStyle}>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={inputStyle}
//           />

//           {/* Role */}
//           <label style={labelStyle}>Role</label>
//           <div style={{ position: "relative", marginBottom: 20 }} ref={roleDropdownRef}>
//             <button
//               type="button"
//               onClick={() => setShowRoleDropdown(!showRoleDropdown)}
//               style={dropdownBtnStyle}
//             >
//               <span>{role}</span> <span style={{ fontSize: 12 }}>▼</span>
//             </button>
//             {showRoleDropdown && (
//               <div style={dropdownStyle}>
//                 {roles.map((r) => (
//                   <div
//                     key={r}
//                     onClick={() => {
//                       setRole(r);
//                       setShowRoleDropdown(false);
//                       setProgram("");
//                       setSemester("");
//                       setFacultyPrograms([]);
//                       setFacultyCourses([]);
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#dbe9f4")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "transparent")
//                     }
//                     style={dropdownItemStyle}
//                   >
//                     {r}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Student: program and semester */}
//           {role === "student" && (
//             <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
//               <div style={{ flex: 1, position: "relative" }} ref={programDropdownRef}>
//                 <label style={labelStyle}>Program</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowProgramDropdown(!showProgramDropdown)}
//                   style={dropdownBtnStyle}
//                 >
//                   <span>{program || "Select program"}</span>{" "}
//                   <span style={{ fontSize: 12 }}>▼</span>
//                 </button>
//                 {showProgramDropdown && (
//                   <div style={dropdownStyle}>
//                     {PROGRAMS.map((p) => (
//                       <div
//                         key={p}
//                         onClick={() => {
//                           setProgram(p);
//                           setShowProgramDropdown(false);
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#dbe9f4")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.backgroundColor = "transparent")
//                         }
//                         style={dropdownItemStyle}
//                       >
//                         {p}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div style={{ flex: 1, position: "relative" }} ref={semesterDropdownRef}>
//                 <label style={labelStyle}>Semester</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
//                   style={dropdownBtnStyle}
//                 >
//                   <span>{semester || "Select semester"}</span>{" "}
//                   <span style={{ fontSize: 12 }}>▼</span>
//                 </button>
//                 {showSemesterDropdown && (
//                   <div style={dropdownStyle}>
//                     {SEMESTERS.map((s) => (
//                       <div
//                         key={s}
//                         onClick={() => {
//                           setSemester(s);
//                           setShowSemesterDropdown(false);
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = "#dbe9f4")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.backgroundColor = "transparent")
//                         }
//                         style={dropdownItemStyle}
//                       >
//                         {s}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Faculty */}
//           {role === "faculty" && (
//             <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
//               <div style={{ flex: 1, position: "relative" }} ref={facultyProgramDropdownRef}>
//                 <label style={labelStyle}>Programs</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowFacultyProgramDropdown(!showFacultyProgramDropdown)}
//                   style={dropdownBtnStyle}
//                 >
//                   <span>
//                     {facultyPrograms.length > 0
//                       ? facultyPrograms.join(", ")
//                       : "Select program(s)"}
//                   </span>
//                   <span style={{ fontSize: 12 }}>▼</span>
//                 </button>
//                 {showFacultyProgramDropdown && (
//                   <div style={dropdownStyle}>
//                     {PROGRAMS.map((p) => (
//                       <div
//                         key={p}
//                         onClick={() => setFacultyPrograms(toggleArrayValue(facultyPrograms, p))}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = facultyPrograms.includes(p)
//                             ? "#c0d4f7"
//                             : "#dbe9f4")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.backgroundColor = facultyPrograms.includes(p)
//                             ? "#c0d4f7"
//                             : "transparent")
//                         }
//                         style={{
//                           ...dropdownItemStyle,
//                           backgroundColor: facultyPrograms.includes(p) ? "#c0d4f7" : "transparent",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           cursor: "pointer",
//                           userSelect: "none",
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={facultyPrograms.includes(p)}
//                           readOnly
//                           tabIndex={-1}
//                           style={{ cursor: "pointer" }}
//                         />
//                         <span>{p}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div style={{ flex: 1, position: "relative" }} ref={facultyCourseDropdownRef}>
//                 <label style={labelStyle}>Courses</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowFacultyCourseDropdown(!showFacultyCourseDropdown)}
//                   style={dropdownBtnStyle}
//                 >
//                   <span>
//                     {facultyCourses.length > 0
//                       ? facultyCourses.join(", ")
//                       : "Select course(s)"}
//                   </span>
//                   <span style={{ fontSize: 12 }}>▼</span>
//                 </button>
//                 {showFacultyCourseDropdown && (
//                   <div style={dropdownStyle}>
//                     {COURSES.map((c) => (
//                       <div
//                         key={c}
//                         onClick={() => setFacultyCourses(toggleArrayValue(facultyCourses, c))}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.backgroundColor = facultyCourses.includes(c)
//                             ? "#c0d4f7"
//                             : "#dbe9f4")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.backgroundColor = facultyCourses.includes(c)
//                             ? "#c0d4f7"
//                             : "transparent")
//                         }
//                         style={{
//                           ...dropdownItemStyle,
//                           backgroundColor: facultyCourses.includes(c) ? "#c0d4f7" : "transparent",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                           cursor: "pointer",
//                           userSelect: "none",
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={facultyCourses.includes(c)}
//                           readOnly
//                           tabIndex={-1}
//                           style={{ cursor: "pointer" }}
//                         />
//                         <span>{c}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <button type="submit" style={btnStyle}>
//             Sign Up
//           </button>
//         </form>

//         <div style={{ marginTop: 20, textAlign: "center" }}>
//           <span>Already have an account? </span>
//           <button onClick={() => navigate("/login")} style={linkStyle}>
//             Log In
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ⬇️ Styles
// const containerStyle = {
//   maxWidth: 600,
//   margin: "50px auto",
//   padding: 30,
//   boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//   borderRadius: 12,
//   backgroundColor: "white",
//   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// };

// const titleStyle = {
//   textAlign: "center",
//   marginBottom: 10,
//   color: "#1C2E4A",
//   fontWeight: "700",
//   fontSize: 32,
// };
// const subTitleStyle = {
//   textAlign: "center",
//   marginBottom: 30,
//   color: "#333",
//   fontWeight: "600",
// };
// const labelStyle = { fontWeight: "600", marginBottom: 6, display: "block", color: "#444" };
// const inputStyle = {
//   width: "100%",
//   padding: "12px 16px",
//   marginBottom: 12,
//   borderRadius: 8,
//   border: "1px solid #ccc",
//   fontSize: 16,
//   outline: "none",
//   boxSizing: "border-box",
// };

// const btnStyle = {
//   width: "100%",
//   padding: "14px",
//   backgroundColor: "#1C2E4A",
//   color: "white",
//   border: "none",
//   borderRadius: 8,
//   fontSize: 18,
//   fontWeight: "600",
//   cursor: "pointer",
// };

// const dropdownStyle = {
//   position: "absolute",
//   top: "100%",
//   left: 0,
//   width: "100%",
//   backgroundColor: "white",
//   border: "1px solid #ccc",
//   borderRadius: 8,
//   marginTop: 4,
//   zIndex: 10,
//   boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//   maxHeight: 160,
//   overflowY: "auto",
// };

// const dropdownItemStyle = {
//   padding: "10px 15px",
//   cursor: "pointer",
//   userSelect: "none",
// };

// const dropdownBtnStyle = {
//   ...inputStyle,
//   cursor: "pointer",
//   textAlign: "left",
//   userSelect: "none",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   backgroundColor: "white",
// };

// const linkStyle = {
//   color: "#1C2E4A",
//   cursor: "pointer",
//   textDecoration: "underline",
//   fontWeight: "600",
// };

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../api/api"; // adjust path if needed

const PROGRAMS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Bachelor of Business Information Systems (BBIS)",
];
const COURSES = [
  "MAS101",
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Database Systems",
  "Networks",
];
const SEMESTERS = ["1st Semester", "2nd Semester", "3rd Semester", "4"];

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [facultyPrograms, setFacultyPrograms] = useState([]);
  const [facultyCourses, setFacultyCourses] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showFacultyProgramDropdown, setShowFacultyProgramDropdown] =
    useState(false);
  const [showFacultyCourseDropdown, setShowFacultyCourseDropdown] =
    useState(false);

  const navigate = useNavigate();

  const roleDropdownRef = useRef(null);
  const programDropdownRef = useRef(null);
  const semesterDropdownRef = useRef(null);
  const facultyProgramDropdownRef = useRef(null);
  const facultyCourseDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target)
      )
        setShowRoleDropdown(false);
      if (
        programDropdownRef.current &&
        !programDropdownRef.current.contains(event.target)
      )
        setShowProgramDropdown(false);
      if (
        semesterDropdownRef.current &&
        !semesterDropdownRef.current.contains(event.target)
      )
        setShowSemesterDropdown(false);
      if (
        facultyProgramDropdownRef.current &&
        !facultyProgramDropdownRef.current.contains(event.target)
      )
        setShowFacultyProgramDropdown(false);
      if (
        facultyCourseDropdownRef.current &&
        !facultyCourseDropdownRef.current.contains(event.target)
      )
        setShowFacultyCourseDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleArrayValue = (arr, val) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!email.endsWith("@ku.edu.np") && !email.endsWith("@kusom.edu.np")) {
  //     alert("Only KU emails allowed!");
  //     return;
  //   }
  //   if (role === "student" && (!program || !semester)) {
  //     alert("Please select a program and semester.");
  //     return;
  //   }
  //   if (role === "faculty" && (facultyPrograms.length === 0 || facultyCourses.length === 0)) {
  //     alert("Please select at least one program and one course.");
  //     return;
  //   }

  //   const userData = { username, email, password, role, program, semester, facultyPrograms, facultyCourses };

  //   try {
  //     await postData("auth/signup", userData); // replace with your backend signup route
  //     alert(`Signed up successfully as ${role}!`);
  //     navigate("/auth/login");
  //   } catch (error) {
  //     console.error(error);
  //     alert(error.response?.data?.message || "Signup failed. Please try again.");
  //   }
  // };

  // const roles = ["student", "faculty"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate KU email
    if (!email.endsWith("@ku.edu.np") && !email.endsWith("@kusom.edu.np")) {
      alert("Only KU emails allowed!");
      return;
    }

    // Validate student fields
    if (role === "student" && (!program || !semester)) {
      alert("Please select a program and semester.");
      return;
    }

    // Validate faculty fields
    if (
      role === "faculty" &&
      (facultyPrograms.length === 0 || facultyCourses.length === 0)
    ) {
      alert("Please select at least one program and one course.");
      return;
    }

    // Prepare data for backend
    const userData = {
      username,
      email,
      password,
      role,
      program, // for students
      semester, // for students
      programs: facultyPrograms, // ✅ renamed to match backend
      courses: facultyCourses, // ✅ renamed to match backend
    };

    try {
      await postData("auth/signup", userData); // your backend signup route
      alert(`Signed up successfully as ${role}!`);
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const roles = ["student", "faculty"];

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#D1CFC9", padding: 20 }}
    >
      <div style={containerStyle}>
        <h1 style={titleStyle}>UniLink</h1>
        <h2 style={subTitleStyle}>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>KU Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {/* <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            
          /> */}

          <label style={labelStyle}>Password</label>
<div style={{ position: "relative", marginBottom: 20 }}>
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{ ...inputStyle, paddingRight: 70 }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#1C2E4A",
      fontWeight: "600",
      fontSize: 14,
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

          
          

          <label style={labelStyle}>Role</label>
          <div
            style={{ position: "relative", marginBottom: 20 }}
            ref={roleDropdownRef}
          >
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              style={dropdownBtnStyle}
            >
              <span>{role}</span> <span style={{ fontSize: 12 }}>▼</span>
            </button>
            {showRoleDropdown && (
              <div style={dropdownStyle}>
                {roles.map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleDropdown(false);
                      setProgram("");
                      setSemester("");
                      setFacultyPrograms([]);
                      setFacultyCourses([]);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#dbe9f4")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    style={dropdownItemStyle}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {role === "student" && (
            <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
              <div
                style={{ flex: 1, position: "relative" }}
                ref={programDropdownRef}
              >
                <label style={labelStyle}>Program</label>
                <button
                  type="button"
                  onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                  style={dropdownBtnStyle}
                >
                  <span>{program || "Select program"}</span>{" "}
                  <span style={{ fontSize: 12 }}>▼</span>
                </button>
                {showProgramDropdown && (
                  <div style={dropdownStyle}>
                    {PROGRAMS.map((p) => (
                      <div
                        key={p}
                        onClick={() => {
                          setProgram(p);
                          setShowProgramDropdown(false);
                        }}
                        style={dropdownItemStyle}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{ flex: 1, position: "relative" }}
                ref={semesterDropdownRef}
              >
                <label style={labelStyle}>Semester</label>
                <button
                  type="button"
                  onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
                  style={dropdownBtnStyle}
                >
                  <span>{semester || "Select semester"}</span>{" "}
                  <span style={{ fontSize: 12 }}>▼</span>
                </button>
                {showSemesterDropdown && (
                  <div style={dropdownStyle}>
                    {SEMESTERS.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setSemester(s);
                          setShowSemesterDropdown(false);
                        }}
                        style={dropdownItemStyle}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {role === "faculty" && (
            <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
              <div
                style={{ flex: 1, position: "relative" }}
                ref={facultyProgramDropdownRef}
              >
                <label style={labelStyle}>Programs</label>
                <button
                  type="button"
                  onClick={() =>
                    setShowFacultyProgramDropdown(!showFacultyProgramDropdown)
                  }
                  style={dropdownBtnStyle}
                >
                  <span>
                    {facultyPrograms.length > 0
                      ? facultyPrograms.join(", ")
                      : "Select program(s)"}
                  </span>
                  <span style={{ fontSize: 12 }}>▼</span>
                </button>
                {showFacultyProgramDropdown && (
                  <div style={dropdownStyle}>
                    {PROGRAMS.map((p) => (
                      <div
                        key={p}
                        onClick={() =>
                          setFacultyPrograms(
                            toggleArrayValue(facultyPrograms, p)
                          )
                        }
                        style={dropdownItemStyle}
                      >
                        <input
                          type="checkbox"
                          checked={facultyPrograms.includes(p)}
                          readOnly
                          tabIndex={-1}
                        />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{ flex: 1, position: "relative" }}
                ref={facultyCourseDropdownRef}
              >
                <label style={labelStyle}>Courses</label>
                <button
                  type="button"
                  onClick={() =>
                    setShowFacultyCourseDropdown(!showFacultyCourseDropdown)
                  }
                  style={dropdownBtnStyle}
                >
                  <span>
                    {facultyCourses.length > 0
                      ? facultyCourses.join(", ")
                      : "Select course(s)"}
                  </span>
                  <span style={{ fontSize: 12 }}>▼</span>
                </button>
                {showFacultyCourseDropdown && (
                  <div style={dropdownStyle}>
                    {COURSES.map((c) => (
                      <div
                        key={c}
                        onClick={() =>
                          setFacultyCourses(toggleArrayValue(facultyCourses, c))
                        }
                        style={dropdownItemStyle}
                      >
                        <input
                          type="checkbox"
                          checked={facultyCourses.includes(c)}
                          readOnly
                          tabIndex={-1}
                        />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="submit" style={btnStyle}>
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span>Already have an account? </span>
          <button onClick={() => navigate("/auth/login")} style={linkStyle}>
            Log In
          </button>
        </div>

      </div>
    </div>
  );
}

// ⬇️ Styles (same as before)
const containerStyle = {
  maxWidth: 600,
  margin: "50px auto",
  padding: 30,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  borderRadius: 12,
  backgroundColor: "white",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};
const titleStyle = {
  textAlign: "center",
  marginBottom: 10,
  color: "#1C2E4A",
  fontWeight: "700",
  fontSize: 32,
};
const subTitleStyle = {
  textAlign: "center",
  marginBottom: 30,
  color: "#333",
  fontWeight: "600",
};
const labelStyle = {
  fontWeight: "600",
  marginBottom: 6,
  display: "block",
  color: "#444",
};
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};
const btnStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#1C2E4A",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 18,
  fontWeight: "600",
  cursor: "pointer",
};
const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: 8,
  marginTop: 4,
  zIndex: 10,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  maxHeight: 160,
  overflowY: "auto",
};
const dropdownItemStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  userSelect: "none",
};
const dropdownBtnStyle = {
  ...inputStyle,
  cursor: "pointer",
  textAlign: "left",
  userSelect: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "white",
};
const linkStyle = {
  color: "#1C2E4A",
  cursor: "pointer",
  textDecoration: "underline",
  fontWeight: "600",
};
