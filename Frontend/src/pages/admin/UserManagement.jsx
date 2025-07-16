import { useState, useRef, useEffect } from "react";

const primaryColor = "#1C2E4A";
const grayPrimary = "#888";

const programsList = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Mechanical Engineering",
];

const coursesByProgram = {
  "Computer Science": ["Algorithms", "Data Structures", "AI"],
  "Business Administration": ["Marketing", "Finance", "HR"],
  "Electrical Engineering": ["Circuits", "Signals", "Systems"],
  "Mechanical Engineering": ["Thermodynamics", "Fluid Mechanics", "Dynamics"],
};

const semestersList = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

const initialUsers = [
  {
    id: 1,
    name: "Alice",
    email: "alice@ku.edu.np",
    role: "student",
    program: "Computer Science",
    semester: "Fall 2023",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@ku.edu.np",
    role: "faculty",
    programs: ["Business Administration", "Electrical Engineering"],
    courses: ["Marketing", "Circuits"],
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@ku.edu.np",
    role: "admin",
  },
];

// Shared prettier dropdown style for all selects
const prettierDropdownStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: `1.5px solid ${primaryColor}`,
  outlineColor: primaryColor,
  cursor: "pointer",
  userSelect: "none",
  fontSize: 16,
  boxShadow: "0 1px 6px rgba(28,46,74,0.1)",
  backgroundColor: "white",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  minWidth: 140,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
};

// Button style without hover as requested
const buttonStyle = (bgColor, flex1 = false) => ({
  flex: flex1 ? 1 : "unset",
  padding: "10px 15px",
  background: bgColor,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 15,
  outline: "none",
});

// Checkbox label style for checklist
const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
  marginBottom: 6,
  fontSize: 15,
  color: primaryColor,
};

const checkboxInputStyle = {
  marginRight: 8,
  cursor: "pointer",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    program: "",
    semester: "",
    programs: [],
    courses: [],
  });

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // All courses for selected programs (unique)
  const selectedCoursesForPrograms = Array.from(
    new Set(
      formData.programs
        .map((prog) => coursesByProgram[prog] || [])
        .flat()
    )
  );

  const filteredUsers = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterRole || u.role === filterRole)
  );
  const isValidKuEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@(ku\.edu\.np|kusom\.edu\.np)$/.test(email);


  // Checkbox handler for faculty programs and courses
  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const currentArr = prev[name];
      let updatedArr;
      if (currentArr.includes(value)) {
        // Remove if already selected
        updatedArr = currentArr.filter((v) => v !== value);
      } else {
        // Add new
        updatedArr = [...currentArr, value];
      }
      // If programs changed, also remove courses not in new programs courses
      if (name === "programs") {
        const allowedCourses = updatedArr
          .map((prog) => coursesByProgram[prog] || [])
          .flat();
        const filteredCourses = prev.courses.filter((c) =>
          allowedCourses.includes(c)
        );
        return { ...prev, [name]: updatedArr, courses: filteredCourses };
      }
      return { ...prev, [name]: updatedArr };
    });
  };

  // Handle other inputs normally
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "student",
      program: "",
      semester: "",
      programs: [],
      courses: [],
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill in name and email.");
      return;
    }

    if (!isValidKuEmail(formData.email)) {
      alert("Please enter a valid KU email address (ending with @ku.edu.np, @kusom.edu.np).");
      return;
    }

    if (formData.role === "student") {
      if (!formData.program || !formData.semester) {
        alert("Please select program and semester for student.");
        return;
      }
    }
    if (formData.role === "faculty") {
      if (formData.programs.length === 0 || formData.courses.length === 0) {
        alert("Please select at least one program and one course for faculty.");
        return;
      }
    }

    if (editingUser) {
      setUsers((users) =>
        users.map((u) => (u.id === editingUser.id ? { id: u.id, ...formData } : u))
      );
      alert("User updated!");
    } else {
      const newUser = { id: Date.now(), ...formData };
      setUsers((prev) => [newUser, ...prev]);
      alert("User added!");
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (editingUser?.id === id) resetForm();
    }
    setOpenMenuId(null);
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "student",
      program: user.program || "",
      semester: user.semester || "",
      programs: user.programs || [],
      courses: user.courses || [],
    });
    setShowForm(true);
    setOpenMenuId(null);
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: primaryColor,
      }}
    >
      <h2 style={{ marginBottom: 20, userSelect: "none" }}>User Management</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "10px",
            borderRadius: "8px",
            border: `1.5px solid ${primaryColor}`,
            outlineColor: primaryColor,
            fontSize: 16,
            boxShadow: "0 1px 6px rgba(28,46,74,0.1)",
            backgroundColor: "white",
          }}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: `1.5px solid ${primaryColor}`,
            outlineColor: primaryColor,
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "0 1px 6px rgba(28,46,74,0.1)",
            backgroundColor: "white",
            minWidth: 140,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={buttonStyle(primaryColor)}
        >
          Add User
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredUsers.length ? (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              style={{
                padding: 15,
                border: `1px solid ${primaryColor}`,
                borderRadius: "8px",
                background: "#fefefe",
                position: "relative",
                boxShadow: "0 1px 5px rgba(28,46,74,0.1)",
                userSelect: "none",
              }}
            >
              <h4 style={{ marginBottom: 6 }}>{u.name}</h4>
              <p style={{ margin: "4px 0", color: "#555", fontSize: 14 }}>{u.email}</p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: grayPrimary,
                  textTransform: "capitalize",
                  marginBottom: 8,
                }}
              >
                Role: {u.role}
              </p>

              {u.role === "student" && (
                <>
                  <p style={{ fontSize: 13, marginBottom: 2 }}>
                    <strong>Program:</strong> {u.program || "—"}
                  </p>
                  <p style={{ fontSize: 13 }}>
                    <strong>Semester:</strong> {u.semester || "—"}
                  </p>
                </>
              )}
              {u.role === "faculty" && (
                <>
                  <p style={{ fontSize: 13, marginBottom: 2 }}>
                    <strong>Programs:</strong> {u.programs?.join(", ") || "—"}
                  </p>
                  <p style={{ fontSize: 13 }}>
                    <strong>Courses:</strong> {u.courses?.join(", ") || "—"}
                  </p>
                </>
              )}

              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: primaryColor,
                  lineHeight: 1,
                  padding: "2px 6px",
                }}
                onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
              >
                ⋮
              </div>

              {openMenuId === u.id && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: 35,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                    color: primaryColor,
                    fontWeight: "600",
                    userSelect: "none",
                    cursor: "pointer",
                    background: "white",
                    padding: "6px 10px",
                    borderRadius: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 10,
                    minWidth: 90,
                  }}
                >
                  <span onClick={() => startEdit(u)}>Edit</span>
                  <span
                    onClick={() => handleDelete(u.id)}
                    style={{ color: "#d9534f" }}
                  >
                    Delete
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: grayPrimary, gridColumn: "1 / -1" }}>No users found.</div>
        )}
      </div>

      {showForm && (
        <>
          <div
            onClick={resetForm}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: "90%",
              maxWidth: 450,
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1001,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 15 }}>{editingUser ? "Edit User" : "Add User"}</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1.5px solid ${primaryColor}`,
                  outlineColor: primaryColor,
                  boxShadow: "0 1px 6px rgba(28,46,74,0.1)",
                  backgroundColor: "white",
                  fontSize: 16,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1.5px solid ${primaryColor}`,
                  outlineColor: primaryColor,
                  boxShadow: "0 1px 6px rgba(28,46,74,0.1)",
                  backgroundColor: "white",
                  fontSize: 16,
                }}
              />
              <select
                name="role"
                value={formData.role}
                onChange={(e) => {
                  handleInputChange(e);
                  // Reset program/semester/courses when role changes
                  setFormData((prev) => ({
                    ...prev,
                    program: "",
                    semester: "",
                    programs: [],
                    courses: [],
                  }));
                }}
                style={prettierDropdownStyle}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>

              {/* STUDENT fields side by side */}
              {formData.role === "student" && (
                <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    style={{ ...prettierDropdownStyle, flex: 1 }}
                  >
                    <option value="">Select Program</option>
                    {programsList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    style={{ ...prettierDropdownStyle, flex: 1 }}
                  >
                    <option value="">Select Semester</option>
                    {semestersList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* FACULTY checklists side by side */}
              {formData.role === "faculty" && (
                <div style={{ display: "flex", gap: 30, marginTop: 10 }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ fontWeight: "600", marginBottom: 6, display: "block" }}>
                      Programs:
                    </label>
                    {programsList.map((p) => (
                      <label key={p} style={checkboxLabelStyle}>
                        <input
                          type="checkbox"
                          name="programs"
                          value={p}
                          checked={formData.programs.includes(p)}
                          onChange={() => handleCheckboxChange("programs", p)}
                          style={checkboxInputStyle}
                        />
                        {p}
                      </label>
                    ))}
                  </div>

                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ fontWeight: "600", marginBottom: 6, display: "block" }}>
                      Courses:
                    </label>
                    {formData.programs.length === 0 ? (
                      <p
                        style={{
                          fontStyle: "italic",
                          color: grayPrimary,
                          fontSize: 14,
                          marginTop: 6,
                        }}
                      >
                        Select programs first
                      </p>
                    ) : (
                      selectedCoursesForPrograms.map((course) => (
                        <label key={course} style={checkboxLabelStyle}>
                          <input
                            type="checkbox"
                            name="courses"
                            value={course}
                            checked={formData.courses.includes(course)}
                            onChange={() => handleCheckboxChange("courses", course)}
                            style={checkboxInputStyle}
                          />
                          {course}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" style={buttonStyle(primaryColor, true)}>
                  {editingUser ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={buttonStyle(grayPrimary, true)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
