import { useState, useEffect, useRef } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function Courses({ user }) {
  // ... your existing states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "MGT201",
      courseName: "Marketing Basics",
      description: "An intro to marketing",
      program: "BBA",
      semester: 2,
    },
    {
      id: 2,
      courseCode: "CSIT301",
      courseName: "Data Structures",
      description: "Linear and nonlinear data structures",
      program: "BSc CSIT",
      semester: 4,
    },
  ]);

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    program: "",
    semester: null,
  });

  const filteredCourses = courses.filter(
    (c) =>
      (!selectedProgram || c.program.toLowerCase().includes(selectedProgram.toLowerCase())) &&
      (!selectedSemester || c.semester === selectedSemester) &&
      (!searchTerm ||
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add or update course
  const addOrUpdateCourse = (e) => {
    e.preventDefault();
    if (!form.courseCode || !form.courseName || !form.program || !form.semester) {
      alert("Please fill all required fields.");
      return;
    }
    if (editCourseId) {
      // Update existing course
      setCourses(
        courses.map((c) => (c.id === editCourseId ? { id: editCourseId, ...form } : c))
      );
    } else {
      // Add new course
      const newCourse = { id: Date.now(), ...form };
      setCourses([newCourse, ...courses]);
    }
    // Reset form & close
    setForm({
      courseCode: "",
      courseName: "",
      description: "",
      program: "",
      semester: null,
    });
    setShowForm(false);
    setEditCourseId(null);
    setActiveMenuId(null);
  };

  const deleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id));
      setActiveMenuId(null);
    }
  };

  const startEditCourse = (course) => {
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description,
      program: course.program,
      semester: course.semester,
    });
    setEditCourseId(course.id);
    setShowForm(true);
    setActiveMenuId(null);
  };

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const primaryColor = "#1C2E4A";
  const primaryHover = "#163059";
  const grayPrimary = "#888";
  const grayHover = "#666";

  // Close menu if clicked outside
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', sans-serif" }}>
      <h2 style={{ marginBottom: 20, color: primaryColor }}>Courses Management</h2>

      {/* Search, Filter, Reset, Add */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "10px",
            borderRadius: 6,
            border: `1px solid ${primaryColor}`,
            outlineColor: primaryColor,
            fontSize: 16,
          }}
        />
        <button onClick={() => setShowFilter(!showFilter)} style={buttonStyle(primaryColor, primaryHover)}>
          Filter
        </button>
        <button
          onClick={() => {
            setSelectedProgram("");
            setSelectedSemester(null);
            setSearchTerm("");
          }}
          style={buttonStyle(grayPrimary, grayHover)}
        >
          Reset
        </button>
        {user.role === "admin" && (
          <button onClick={() => { setShowForm(true); setEditCourseId(null); }} style={buttonStyle(primaryColor, primaryHover)}>
            Add Course
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilter && (
        <div style={{ padding: 15, border: `1px solid ${primaryColor}`, borderRadius: 6, marginBottom: 25 }}>
          <div style={{ marginBottom: 10 }}>
            <strong style={{ color: primaryColor }}>Program:</strong>{" "}
            <input
              type="text"
              placeholder="Type program..."
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 4,
                border: `1px solid ${primaryColor}`,
                marginLeft: 10,
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <strong style={{ color: primaryColor }}>Semester:</strong>{" "}
            {[...Array(8)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setSelectedSemester(i + 1)}
                style={{
                  marginLeft: 5,
                  padding: "5px 10px",
                  border: selectedSemester === i + 1 ? `2px solid ${primaryColor}` : `1px solid ${primaryColor}`,
                  borderRadius: 4,
                  background: selectedSemester === i + 1 ? "#e6f0ff" : "white",
                  cursor: "pointer",
                  color: primaryColor,
                  fontWeight: selectedSemester === i + 1 ? "700" : "400",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            style={{
              padding: 15,
              border: `1px solid ${primaryColor}`,
              borderRadius: 6,
              background: "#fefefe",
              boxShadow: "0 1px 5px rgba(28,46,74,0.1)",
              position: "relative",
            }}
          >
            <h4 style={{ color: primaryColor, marginBottom: 6 }}>{c.courseName}</h4>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
              <strong>Code:</strong> {c.courseCode}
            </p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
              <strong>Program:</strong> {c.program}
            </p>
            <p style={{ fontSize: 13, color: "#555" }}>
              <strong>Semester:</strong> {c.semester}
            </p>

            {user.role === "admin" && (
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <FiMoreVertical
                  color={primaryColor}
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleMenu(c.id)}
                  title="Actions"
                />
                {activeMenuId === c.id && (
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      top: 26,
                      right: 0,
                      background: "white",
                      border: `1px solid ${primaryColor}`,
                      borderRadius: 6,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      zIndex: 10,
                      width: 120,
                      userSelect: "none",
                    }}
                  >
                    <button
                      onClick={() => startEditCourse(c)}
                      style={{
                        width: "100%",
                        padding: 8,
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        color: primaryColor,
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      style={{
                        width: "100%",
                        padding: 8,
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "red",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Course Form Popup */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(28,46,74,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: 60,
            zIndex: 999,
          }}
        >
          <div style={{ background: "white", padding: 30, borderRadius: 8, width: 400 }}>
            <h3 style={{ color: primaryColor, marginBottom: 15 }}>
              {editCourseId ? "Edit Course" : "Add New Course"}
            </h3>
            <form onSubmit={addOrUpdateCourse} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Course Code"
                value={form.courseCode}
                onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                required
                style={formInputStyle}
              />
              <input
                type="text"
                placeholder="Course Name"
                value={form.courseName}
                onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                required
                style={formInputStyle}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
                style={{ ...formInputStyle, resize: "vertical" }}
              />
              <input
                type="text"
                placeholder="Program"
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                required
                style={formInputStyle}
              />
              <div>
                <strong style={{ color: primaryColor }}>Semester:</strong>{" "}
                {[...Array(8)].map((_, i) => (
                  <button
                    type="button"
                    key={i + 1}
                    onClick={() => setForm({ ...form, semester: i + 1 })}
                    style={{
                      marginLeft: 5,
                      padding: "4px 8px",
                      border:
                        form.semester === i + 1 ? `2px solid ${primaryColor}` : `1px solid #ccc`,
                      background: form.semester === i + 1 ? "#e6f0ff" : "white",
                      borderRadius: 4,
                      color: primaryColor,
                      cursor: "pointer",
                      fontWeight: form.semester === i + 1 ? "700" : "400",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" style={buttonStyle(primaryColor, primaryHover, true)}>
                  {editCourseId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditCourseId(null);
                  }}
                  style={buttonStyle(grayPrimary, grayHover, true)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable button style
const buttonStyle = (bg, hover, flex1 = false) => ({
  flex: flex1 ? 1 : "unset",
  padding: "10px 15px",
  background: bg,
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 15,
  transition: "background-color 0.3s ease",
  minWidth: 90,
});

// Input style
const formInputStyle = {
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: 15,
  outlineColor: "#1C2E4A",
  boxSizing: "border-box",
};
