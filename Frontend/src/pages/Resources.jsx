import React, { useState, useEffect } from "react";
import { getData, postFormData, putData, deleteData } from "../api/api";

// Example programs data
const programsData = [
  { programName: "BBIS", semesters: 8, schoolName: "Kathmandu University School of Management" },
  { programName: "BBA", semesters: 8, schoolName: "Kathmandu University School of Management" },
  { programName: "B.E. in Computer Engineering", semesters: 8, schoolName: "Kathmandu University School of Engineering" },
  { programName: "Bachelor of Architecture", semesters: 10, schoolName: "School of Arts & Design" },
];

// Derive current user from localStorage
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};

export default function StudentResourcesPage() {
  // Filters & search
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Resources list
  const [resources, setResources] = useState([]);

  // Fetch resources for the current student's/faculty's program on load
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const savedUser = getCurrentUser();
        const programId = savedUser?.program || savedUser?.programs?.[0];
        if (!programId) return;

        const res = await getData(`resources/${programId}`);

        const backendOrigin = (process.env.API_URL || "").replace(/\/api$/, "");
        const mapped = (res?.data || []).map((r) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          type: r.type,
          program: r.program,
          semester: r.semester,
          course: r.relatedCourse,
          date: r.createdAt ? r.createdAt.slice(0, 10) : "",
          uploadedBy: r.uploadedBy?._id,
          uploadedByName: r.uploadedBy?.username,
          files: (r.fileUrls || []).map((url, i) => ({
            id: `${r._id}-${i}`,
            url: url.startsWith("http") ? url : `${backendOrigin}${url}`,
            name: url.split("/").pop(),
          })),
        }));
        setResources(mapped);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };
    fetchResources();
  }, []);

  // Reusable fetch to refresh list after actions
  const fetchResources = async () => {
    try {
      const savedUser = getCurrentUser();
      const programId = savedUser?.program || savedUser?.programs?.[0];
      if (!programId) return;
      const res = await getData(`resources/${programId}`);
      const backendOrigin = (process.env.API_URL || "").replace(/\/api$/, "");
      const mapped = (res?.data || []).map((r) => ({
        id: r._id,
        title: r.title,
        description: r.description,
        type: r.type,
        program: r.program,
        semester: r.semester,
        course: r.relatedCourse,
        date: r.createdAt ? r.createdAt.slice(0, 10) : "",
        uploadedBy: r.uploadedBy?._id,
        uploadedByName: r.uploadedBy?.username,
        files: (r.fileUrls || []).map((url, i) => ({
          id: `${r._id}-${i}`,
          url: url.startsWith("http") ? url : `${backendOrigin}${url}`,
          name: url.split("/").pop(),
        })),
      }));
      setResources(mapped);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailResource, setDetailResource] = useState(null);

  // Upload/Edit form states
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formResourceId, setFormResourceId] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("");
  const [formProgram, setFormProgram] = useState("");
  const [formSemester, setFormSemester] = useState(null);
  const [formCourse, setFormCourse] = useState("");
  const [formFiles, setFormFiles] = useState([]); // multiple files

  // Colors
  const primaryColor = "#1C2E4A";
  const primaryHover = "#163059";
  const grayPrimary = "#888888";
  const grayHover = "#555555";

  // Get semesters count for selected program (filter panel)
  const currentProgram = programsData.find(
    (prog) => prog.programName === selectedProgram
  );
  const semestersCount = currentProgram ? currentProgram.semesters : 8;

  // Reset semester filter when program changes
  useEffect(() => {
    setSelectedSemester(null);
  }, [selectedProgram]);

  // Filter resources by search and filters
  const filteredResources = resources.filter((res) => {
    if (selectedProgram && res.program !== selectedProgram) return false;
    if (selectedSemester && res.semester !== selectedSemester) return false;
    if (selectedCourse && !res.course.toLowerCase().includes(selectedCourse.toLowerCase())) return false;
    if (searchTerm && !res.title.toLowerCase().includes(searchTerm.toLowerCase()) && !res.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Show detail modal for resource
  function openDetailModal(resource) {
    setDetailResource(resource);
    setShowDetailModal(true);
  }
  function closeDetailModal() {
    setDetailResource(null);
    setShowDetailModal(false);
  }

  // Open upload/edit form
  function openForm(resource = null) {
    if (resource) {
      // Edit mode: fill form with existing resource
      setEditMode(true);
      setFormResourceId(resource.id);
      setFormTitle(resource.title);
      setFormDescription(resource.description);
      setFormType(resource.type);
      setFormProgram(resource.program);
      setFormSemester(resource.semester);
      setFormCourse(resource.course);
      setFormFiles([]); // can't prefill files input, keep empty for upload new files
    } else {
      // New upload mode: clear form
      setEditMode(false);
      setFormResourceId(null);
      setFormTitle("");
      setFormDescription("");
      setFormType("");
      setFormProgram("");
      setFormSemester(null);
      setFormCourse("");
      setFormFiles([]);
    }
    setShowForm(true);
  }

  // Handle multiple file selection
  function onFilesChange(e) {
    setFormFiles(Array.from(e.target.files));
  }

  // Handle form submit (upload or edit via API)
  async function handleSubmitForm(e) {
    e.preventDefault();

    if (!formTitle || !formType || !formCourse) {
      alert("Please fill in all required fields");
      return;
    }

    const savedUser = getCurrentUser();
    const programId = savedUser?.program || savedUser?.programs?.[0];
    const semesterFromUser = savedUser?.semester;

    try {
      if (editMode && formResourceId) {
        // Update metadata (no file upload on edit here)
        await putData(`resources/${formResourceId}`, {
          title: formTitle,
          description: formDescription,
          type: formType,
          program: programId,
          semester: semesterFromUser ?? formSemester,
          relatedCourse: formCourse,
        });
        alert("Resource updated!");
      } else {
        // Create new with file uploads
        const formData = new FormData();
        formData.append("title", formTitle);
        if (formDescription) formData.append("description", formDescription);
        formData.append("type", formType);
        formData.append("program", programId);
        if (semesterFromUser ?? formSemester) formData.append("semester", String(semesterFromUser ?? formSemester));
        if (formCourse) formData.append("relatedCourse", formCourse);
        formFiles.forEach((file) => formData.append("files", file));

        await postFormData(`resources`, formData);
        alert("Resource uploaded!");
      }

      // Refresh list
      await fetchResources();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to submit resource:", err);
      alert(err.response?.data?.message || "Failed to submit resource.");
    }
  }

  // Handle delete resource with permission check
  async function handleDelete(resource) {
    if (
      (getCurrentUser()?.role === "admin") ||
      (resource.uploadedBy === (getCurrentUser()?._id || getCurrentUser()?.id) &&
        (["faculty", "student"].includes(getCurrentUser()?.role || "")))
    ) {
      if (window.confirm("Are you sure you want to delete this resource?")) {
        try {
          await deleteData(`resources/${resource.id}`);
          await fetchResources();
          if (detailResource?.id === resource.id) closeDetailModal();
        } catch (err) {
          console.error("Delete failed:", err);
          alert(err.response?.data?.message || "Failed to delete resource");
        }
      }
    } else {
      alert("You don't have permission to delete this resource.");
    }
  }

  // Render semester buttons helper (for filter panel and form)
  function renderSemesterButtons(selected, setSelected, count = 8) {
    const buttons = [];
    for (let i = 1; i <= count; i++) {
      buttons.push(
        <button
          key={i}
          type="button"
          onClick={() => setSelected(i)}
          style={{
            marginLeft: "5px",
            padding: "6px 10px",
            border: selected === i ? `2px solid ${primaryColor}` : `1px solid ${primaryColor}`,
            borderRadius: "4px",
            background: selected === i ? "#e6f0ff" : "white",
            cursor: "pointer",
            color: primaryColor,
            fontWeight: selected === i ? "700" : "400",
            userSelect: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e6f0ff";
            e.currentTarget.style.border = `2px solid ${primaryHover}`;
            e.currentTarget.style.color = primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = selected === i ? "#e6f0ff" : "white";
            e.currentTarget.style.border = selected === i ? `2px solid ${primaryColor}` : `1px solid ${primaryColor}`;
            e.currentTarget.style.color = primaryColor;
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: primaryColor, userSelect: "none" }}>Resources</h2>

      {/* Search and Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search resources..."
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
          style={{
            padding: "10px 15px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 15,
            whiteSpace: "nowrap",
          }}
        >
          Filter
        </button>

        <button
  onClick={() => {
    setSelectedProgram("");
    setSelectedSemester(null);
    setSelectedCourse("");
    setSearchTerm("");
  }}
  style={{
    padding: "10px 15px",
    background: "#777",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 15,
    whiteSpace: "nowrap",
  }}
>
  Reset
</button>

        <button
          onClick={() => openForm()}
          style={{
            padding: "10px 15px",
            background: primaryColor,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 15,
            whiteSpace: "nowrap",
          }}
        >
          Upload Resource
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div
          style={{
            padding: "15px",
            border: `1px solid ${primaryColor}`,
            borderRadius: "6px",
            marginBottom: "25px",
            backgroundColor: "#f9faff",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: primaryColor }}>Program:</strong>{" "}
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
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
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: primaryColor }}>Semester:</strong>{" "}
            {renderSemesterButtons(selectedSemester, setSelectedSemester, semestersCount)}
          </div>
          <div>
            <strong style={{ color: primaryColor }}>Course:</strong>{" "}
            <input
              type="text"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              placeholder="Filter by course"
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: `1px solid ${primaryColor}`,
                marginLeft: "10px",
                fontSize: 14,
                color: primaryColor,
                minWidth: "160px",
              }}
            />
          </div>
        </div>
      )}

      {/* Resources grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const savedUser = getCurrentUser();
            const canEditOrDelete =
              savedUser?.role === "admin" ||
              (res.uploadedBy === (savedUser?._id || savedUser?.id) && (["faculty", "student"].includes(savedUser?.role)));
            return (
              <div
                key={res.id}
                style={{
                  padding: "15px",
                  border: `1px solid ${primaryColor}`,
                  borderRadius: "6px",
                  boxShadow: "0 1px 5px rgba(28, 46, 74, 0.1)",
                  backgroundColor: "#fefefe",
                  userSelect: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "box-shadow 0.3s ease",
                }}
                onClick={() => openDetailModal(res)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(28, 46, 74, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 5px rgba(28, 46, 74, 0.1)";
                }}
              >
                {/* Three dots menu */}
                {canEditOrDelete && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <ThreeDotMenu
                      onEdit={() => openForm(res)}
                      onDelete={() => handleDelete(res)}
                    />
                  </div>
                )}

                <h4 style={{ marginBottom: 6, color: primaryColor }}>{res.title}</h4>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: 10 }}>
                  {res.description}
                </p>
                <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
                  <div>
                    <strong>Type:</strong> {res.type}
                  </div>
                  <div>
                    <strong>Program:</strong> {res.program}
                  </div>
                  <div>
                    <strong>Semester:</strong> {res.semester}
                  </div>
                  <div>
                    <strong>Course:</strong> {res.course}
                  </div>
                  <div>
                    <strong>Date:</strong> {res.date}
                  </div>
                  <div style={{ marginTop: 6, fontSize: "12px", color: "#999" }}>
                    Uploaded by: {res.uploadedByName || "Unknown"}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: "#777", gridColumn: "1 / -1", userSelect: "none" }}>
            No resources match your filters.
          </div>
        )}
      </div>

      {/* Detail modal */}
      {showDetailModal && detailResource && (
        <Modal onClose={closeDetailModal}>
          <h3 style={{ color: primaryColor, marginBottom: "10px" }}>{detailResource.title}</h3>
          <p>{detailResource.description}</p>
          <p>
            <strong>Type:</strong> {detailResource.type} <br />
            <strong>Program:</strong> {detailResource.program} <br />
            <strong>Semester:</strong> {detailResource.semester} <br />
            <strong>Course:</strong> {detailResource.course} <br />
            <strong>Date:</strong> {detailResource.date} <br />
            <strong>Uploaded by:</strong> {detailResource.uploadedByName || "Unknown"}
          </p>
          <div style={{ marginTop: 10 }}>
            <strong>Files:</strong>
            {detailResource.files.length > 0 ? (
              <ul>
                {detailResource.files.map((file) => (
                  <li key={file.id} style={{ marginBottom: 6 }}>
                    <a href={file.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files uploaded.</p>
            )}
          </div>
          <button
            onClick={closeDetailModal}
            style={{
              marginTop: "15px",
              padding: "8px 14px",
              background: primaryColor,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </Modal>
      )}

      {/* Upload/Edit form modal */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h3 style={{ color: primaryColor, marginBottom: "15px" }}>
            {editMode ? "Edit Resource" : "Upload New Resource"}
          </h3>
          <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              style={formInputStyle}
            />
            <textarea
              placeholder="Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              style={{ ...formInputStyle, resize: "vertical" }}
            />
            <input
              type="text"
              placeholder="Type (Notes, Guide...)"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              required
              style={formInputStyle}
            />
            <select
              value={formProgram}
              onChange={(e) => setFormProgram(e.target.value)}
              required
              style={{ ...formInputStyle, padding: "10px" }}
            >
              <option value="">Select Program</option>
              {programsData.map((prog) => (
                <option key={prog.programName} value={prog.programName}>
                  {prog.programName}
                </option>
              ))}
            </select>
            <div>
              <strong style={{ color: primaryColor, userSelect: "none" }}>Semester:</strong>
              {renderSemesterButtons(formSemester, setFormSemester, formProgram ? (programsData.find(p => p.programName === formProgram)?.semesters || 8) : 8)}
            </div>
            <input
              type="text"
              placeholder="Course"
              value={formCourse}
              onChange={(e) => setFormCourse(e.target.value)}
              required
              style={formInputStyle}
            />
            <input
              type="file"
              multiple
              onChange={onFilesChange}
              style={{ marginTop: "6px" }}
            />
            {formFiles.length > 0 && (
              <div style={{ fontSize: "13px", marginTop: "5px", color: "#333" }}>
                Selected files: {formFiles.map(f => f.name).join(", ")}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: 10 }}>
              <button type="submit" style={buttonStyle(primaryColor, primaryHover, true)}>
                {editMode ? "Update" : "Submit"}
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

// Modal wrapper component
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

// Three dots menu component
function ThreeDotMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((prev) => !prev);
  }

  // Close menu on outside click
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
            style={menuBtnStyle}
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            style={{ ...menuBtnStyle, color: "red" }}
          >
            Delete
          </button>
        </div>
      )}
      
    </div>
  );
}

const menuBtnStyle = {
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
};
const formInputStyle = {
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: 15,
  outlineColor: "#1C2E4A",
  boxSizing: "border-box",
};
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
