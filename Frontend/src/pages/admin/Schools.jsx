import React, { useState, useEffect } from "react";

// Example programs data (same as your resource example)
const programsData = [
  { programName: "BBIS", semesters: 8, schoolName: "Kathmandu University School of Management" },
  { programName: "BBA", semesters: 8, schoolName: "Kathmandu University School of Management" },
  { programName: "B.E. in Computer Engineering", semesters: 8, schoolName: "Kathmandu University School of Engineering" },
  { programName: "Bachelor of Architecture", semesters: 10, schoolName: "School of Arts & Design" },
];

// Example schools data
const initialSchools = [
  {
    id: "s1",
    schoolName: "Kathmandu University School of Management",
    programs: ["BBIS", "BBA"],
  },
  {
    id: "s2",
    schoolName: "Kathmandu University School of Engineering",
    programs: ["B.E. in Computer Engineering"],
  },
];

export default function SchoolsPage() {
  // Colors & styles (exactly same as resources page)
  const primaryColor = "#1C2E4A";
  const primaryHover = "#163059";
  const grayPrimary = "#888888";
  const grayHover = "#555555";

  // States
  const [schools, setSchools] = useState(initialSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProgramFilter, setSelectedProgramFilter] = useState("");

  // Modal form states
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formSchoolId, setFormSchoolId] = useState(null);
  const [formSchoolName, setFormSchoolName] = useState("");
  const [formPrograms, setFormPrograms] = useState([]);

  // Filtered schools list based on search and program filter
  const filteredSchools = schools.filter((school) => {
    if (searchTerm && !school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedProgramFilter && !school.programs.includes(selectedProgramFilter)) {
      return false;
    }
    return true;
  });

  // Handle program checkbox toggle in form
  function toggleProgram(programName) {
    setFormPrograms((prev) =>
      prev.includes(programName)
        ? prev.filter((p) => p !== programName)
        : [...prev, programName]
    );
  }

  // Reset form state
  function resetForm() {
    setFormSchoolId(null);
    setFormSchoolName("");
    setFormPrograms([]);
    setEditMode(false);
  }

  // Open form for new school or edit existing
  function openForm(school = null) {
    if (school) {
      setEditMode(true);
      setFormSchoolId(school.id);
      setFormSchoolName(school.schoolName);
      setFormPrograms(school.programs);
    } else {
      resetForm();
    }
    setShowForm(true);
  }

  // Handle form submission (add/edit)
  function handleSubmit(e) {
    e.preventDefault();

    if (!formSchoolName.trim()) {
      alert("Please enter the school name");
      return;
    }
    if (formPrograms.length === 0) {
      alert("Please select at least one program");
      return;
    }

    if (editMode) {
      // Update existing school
      setSchools((prev) =>
        prev.map((s) =>
          s.id === formSchoolId
            ? { ...s, schoolName: formSchoolName.trim(), programs: formPrograms }
            : s
        )
      );
      alert("School updated!");
    } else {
      // Add new school
      const newSchool = {
        id: `s${Date.now()}`,
        schoolName: formSchoolName.trim(),
        programs: formPrograms,
      };
      setSchools((prev) => [newSchool, ...prev]);
      alert("School added!");
    }
    setShowForm(false);
  }

  // Handle delete school
  function handleDelete(schoolId) {
    if (window.confirm("Are you sure you want to delete this school?")) {
      setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    }
  }

  // Button style function, same as your Resources page
  const buttonStyle = (bgColor, hoverColor, flex1 = false) => ({
    flex: flex1 ? 1 : "unset",
    padding: "10px 15px",
    background: bgColor,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: "600",
    fontSize: 15,
    userSelect: "none",
    transition: "background-color 0.3s ease",
    outline: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...(flex1 ? {} : { minWidth: 90 }),
  });

  // Form input style same as resources page
  const formInputStyle = {
    padding: "10px 12px",
    borderRadius: "6px",
    border: `1px solid #ccc`,
    fontSize: 15,
    outlineColor: primaryColor,
    boxSizing: "border-box",
  };

  // Three-dot menu component (reuse from your resources page)
  function ThreeDotMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);

    function toggle() {
      setOpen((prev) => !prev);
    }

    useEffect(() => {
      function handleClickOutside(e) {
        if (!e.target.closest(".three-dot-menu")) {
          setOpen(false);
        }
      }
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
      <div className="three-dot-menu" style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={toggle}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: "#666",
            padding: 0,
            userSelect: "none",
            lineHeight: 1,
          }}
          aria-label="Options"
          title="Options"
        >
          ⋮
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              top: "26px",
              right: 0,
              background: "white",
              border: `1px solid #ccc`,
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 10000,
              minWidth: "110px",
            }}
          >
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                userSelect: "none",
                outline: "none",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                userSelect: "none",
                outline: "none",
                color: "red",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  // Modal wrapper component (reuse style)
  function Modal({ children, onClose }) {
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(28, 46, 74, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "60px",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "90%",
            padding: "20px",
            boxShadow: "0 5px 15px rgba(28, 46, 74, 0.3)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: primaryColor, userSelect: "none" }}>Schools Management</h2>

      {/* Search and Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search schools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px",
            borderRadius: "6px",
            border: `1px solid ${primaryColor}`,
            outlineColor: primaryColor,
            fontSize: 16,
          }}
        />
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={buttonStyle(primaryColor, primaryHover, false)}
        >
          Filter
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedProgramFilter("");
          }}
          style={buttonStyle(grayPrimary, grayHover, false)}
        >
          Reset
        </button>
        <button
          onClick={() => openForm()}
          style={buttonStyle(primaryColor, primaryHover, false)}
        >
          Add School
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div
          style={{
            padding: "15px",
            border: `1px solid ${primaryColor}`,
            borderRadius: "6px",
            marginBottom: "25px",
            backgroundColor: "#f9faff",
            userSelect: "none",
          }}
        >
          <label style={{ color: primaryColor, fontWeight: "600" }}>
            Program:{" "}
            <select
              value={selectedProgramFilter}
              onChange={(e) => setSelectedProgramFilter(e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: `1px solid ${primaryColor}`,
                marginLeft: "10px",
                fontSize: 14,
                color: primaryColor,
                minWidth: "160px",
              }}
            >
              <option value="">All Programs</option>
              {programsData.map((prog, i) => (
                <option key={i} value={prog.programName}>
                  {prog.programName}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Schools Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          userSelect: "none",
        }}
      >
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <div
              key={school.id}
              style={{
                padding: "15px",
                border: `1px solid ${primaryColor}`,
                borderRadius: "6px",
                boxShadow: "0 1px 5px rgba(28, 46, 74, 0.1)",
                backgroundColor: "#fefefe",
                position: "relative",
                transition: "box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(28, 46, 74, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 5px rgba(28, 46, 74, 0.1)";
              }}
            >
              {/* Three dots menu */}
              <div
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <ThreeDotMenu
                  onEdit={() => openForm(school)}
                  onDelete={() => handleDelete(school.id)}
                />
              </div>

              <h3 style={{ color: primaryColor, marginBottom: 10 }}>{school.schoolName}</h3>
              <div style={{ fontSize: "14px", color: "#555" }}>
                <strong>Programs:</strong> {school.programs.join(", ")}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "#777", gridColumn: "1 / -1" }}>
            No schools match your filters.
          </div>
        )}
      </div>

      {/* Add/Edit School Modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h3 style={{ color: primaryColor, marginBottom: "15px" }}>
            {editMode ? "Edit School" : "Add New School"}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="School Name"
              value={formSchoolName}
              onChange={(e) => setFormSchoolName(e.target.value)}
              required
              style={formInputStyle}
              autoFocus
            />
            <div>
              <label style={{ fontWeight: "600", color: primaryColor, userSelect: "none" }}>
                Programs:
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "6px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  border: `1px solid #ccc`,
                  borderRadius: "6px",
                  padding: "10px",
                }}
              >
                {programsData.map((prog) => (
                  <label
                    key={prog.programName}
                    style={{
                      userSelect: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: 14,
                      color: primaryColor,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formPrograms.includes(prog.programName)}
                      onChange={() => toggleProgram(prog.programName)}
                    />
                    {prog.programName}
                  </label>
                ))}
                {programsData.length === 0 && (
                  <p style={{ fontStyle: "italic", color: grayPrimary }}>
                    No programs available
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" style={buttonStyle(primaryColor, primaryHover, true)}>
                {editMode ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={buttonStyle(grayPrimary, grayHover, true)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
