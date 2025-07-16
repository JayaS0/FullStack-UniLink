import { useState, useRef, useEffect } from "react";

const primaryColor = "#1C2E4A";
const primaryHover = "#163059";
const grayPrimary = "#888";
const grayHover = "#666";

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("All");

  const [programs, setPrograms] = useState([
    { programName: "BBIS", semesters: 8, schoolName: "Kathmandu University School of Management" },
    { programName: "BBA", semesters: 8, schoolName: "Kathmandu University School of Management" },
    { programName: "B.E. in Computer Engineering", semesters: 8, schoolName: "Kathmandu University School of Engineering" },
    { programName: "Bachelor of Architecture", semesters: 10, schoolName: "School of Arts & Design" },
  ]);

  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgram, setNewProgram] = useState({ programName: "", semesters: 8, schoolName: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProgram, setEditedProgram] = useState({ programName: "", semesters: 8, schoolName: "" });

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueSchools = ["Choose Schools", ...new Set(programs.map((p) => p.schoolName))];

  const filteredPrograms = programs.filter(
    (p) =>
      p.programName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (schoolFilter === "All" || p.schoolName === schoolFilter)
  );

  const buttonStyle = (bgColor, hoverColor, flex1 = false) => ({
    flex: flex1 ? 1 : "unset",
    padding: "10px 15px",
    background: bgColor,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 15,
    transition: "background-color 0.3s ease",
    outline: "none",
  });

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: `1px solid ${primaryColor}`,
    outlineColor: primaryColor,
    fontSize: 16,
    color: primaryColor,
    width: "100%",
    boxSizing: "border-box",
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this program?")) {
      const updated = [...programs];
      updated.splice(index, 1);
      setPrograms(updated);
      setShowMenuIndex(null);
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedProgram(programs[index]);
    setShowMenuIndex(null);
  };

  const handleSaveEdit = () => {
    if (!editedProgram.programName || !editedProgram.schoolName) {
      alert("Program name & School name required");
      return;
    }
    const updated = [...programs];
    updated[editingIndex] = editedProgram;
    setPrograms(updated);
    setEditingIndex(null);
  };

  const handleAddProgram = () => {
    if (!newProgram.programName || !newProgram.schoolName) {
      alert("Program name & School name required");
      return;
    }
    setPrograms([{ ...newProgram }, ...programs]);
    setNewProgram({ programName: "", semesters: 8, schoolName: "" });
    setShowAddForm(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        color: primaryColor,
       
      }}
    >
      <h2 style={{ marginBottom: 20, userSelect: "none" }}>Programs</h2>

      {/* Search, School Filter, Add */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...inputStyle,
            flex: 1,
            minWidth: 220,
          }}
        />

        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: `1px solid ${primaryColor}`,
            fontSize: 16,
            outlineColor: primaryColor,
            color: primaryColor,
            minWidth: 160,
          }}
        >
          {uniqueSchools.map((school, i) => (
            <option key={i} value={school}>
              {school}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAddForm(true)}
          style={buttonStyle(primaryColor, primaryHover)}
        >
        Add Program
        </button>
      </div>

      {/* Program Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}
      >
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program, index) => (
            <div
              key={index}
              style={{
                padding: 15,
                border: `1px solid ${primaryColor}`,
                borderRadius: 6,
                background: "#fefefe",
                position: "relative",
                color: primaryColor,
                userSelect: "none",
                boxShadow: "0 1px 5px rgba(28,46,74,0.1)",
              }}
            >
              {/* Three dots */}
              <div
                onClick={() => setShowMenuIndex(showMenuIndex === index ? null : index)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: "bold",
                  lineHeight: 1,
                  color: primaryColor,
                  userSelect: "none",
                  padding: "2px 6px",
                }}
              >
                ⋮
              </div>

              {/* Dropdown menu */}
              {showMenuIndex === index && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: "600",
                    userSelect: "none",
                    cursor: "pointer",
                    color: primaryColor,
                    background: "#fff",
                    borderRadius: 6,
                    border: `1px solid ${primaryColor}`,
                    boxShadow: "0 3px 8px rgba(28,46,74,0.15)",
                    zIndex: 10,
                    padding: 4,
                    minWidth: 80,
                  }}
                >
                  <span onClick={() => handleEdit(index)} style={{ padding: "6px 10px" }}>
                    Edit
                  </span>
                  <span
                    onClick={() => handleDelete(index)}
                    style={{ padding: "6px 10px", color: "#d9534f" }}
                  >
                    Delete
                  </span>
                </div>
              )}

              {/* Program card content */}
              {editingIndex === index ? (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    value={editedProgram.programName}
                    onChange={(e) =>
                      setEditedProgram({ ...editedProgram, programName: e.target.value })
                    }
                    style={inputStyle}
                    placeholder="Program Name"
                  />
                  <input
                    type="number"
                    value={editedProgram.semesters}
                    onChange={(e) =>
                      setEditedProgram({ ...editedProgram, semesters: parseInt(e.target.value) || 1 })
                    }
                    min={1}
                    max={12}
                    style={{ ...inputStyle, marginTop: 10 }}
                    placeholder="Semesters"
                  />
                  <input
                    type="text"
                    value={editedProgram.schoolName}
                    onChange={(e) =>
                      setEditedProgram({ ...editedProgram, schoolName: e.target.value })
                    }
                    style={{ ...inputStyle, marginTop: 10 }}
                    placeholder="School Name"
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      onClick={handleSaveEdit}
                      style={buttonStyle("#28a745", "#218838", true)}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      style={buttonStyle(grayPrimary, grayHover, true)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 style={{ marginBottom: 6 }}>{program.programName}</h4>
                  <p style={{ margin: "4px 0", fontWeight: "600" }}>
                    Semesters: {program.semesters}
                  </p>
                  <p style={{ fontSize: 13, color: grayPrimary, margin: 0 }}>
                    {program.schoolName}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: grayPrimary, gridColumn: "1 / -1" }}>
            No programs found.
          </div>
        )}
      </div>

      {/* Add Program Modal */}
      {showAddForm && (
        <>
          <div
            onClick={() => setShowAddForm(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: "90%",
              maxWidth: 400,
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1001,
            }}
          >
            <h3 style={{ marginBottom: 15 }}>{`Add New Program`}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProgram();
              }}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <input
                type="text"
                placeholder="Program Name"
                value={newProgram.programName}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, programName: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Semesters"
                value={newProgram.semesters}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    semesters: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                max={12}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="School Name"
                value={newProgram.schoolName}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, schoolName: e.target.value })
                }
                required
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={buttonStyle(primaryColor, primaryHover, true)}>
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={buttonStyle(grayPrimary, grayHover, true)}
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
