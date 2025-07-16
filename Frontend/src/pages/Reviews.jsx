import { useState } from "react";

export default function StudentReviewsPage() {
  const primaryColor = "#1C2E4A";
  const primaryHover = "#163059";
  const grayPrimary = "#888";
  const grayHover = "#666";

  // Simulated logged-in user (change role/id for testing)
  const [currentUser] = useState({
    id: 123,        // must match userId of userSubmitted reviews to allow edit/delete
    role: "admin",  // 'admin', 'student', or 'faculty'
  });

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal form states
  const [showForm, setShowForm] = useState(false);
  const [formCourseId, setFormCourseId] = useState("");
  const [formCourseName, setFormCourseName] = useState("");
  const [formFacultyName, setFormFacultyName] = useState("");
  const [formSemester, setFormSemester] = useState(null);
  const [formProgram, setFormProgram] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Reviewer Info modal state (admin only)
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoReviewer, setInfoReviewer] = useState(null);

  // Reviews state (sample data)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      courseId: "CS101",
      courseName: "Intro to Computer Science",
      facultyName: "Prof. Smith",
      rating: 5,
      comment: "Excellent course!",
      semester: 3,
      program: "Computer Science",
      userSubmitted: false,
      reviewer: { username: "john_doe", program: "Computer Science", semester: "3" },
      userId: 456,
    },
    {
      id: 2,
      courseId: "FA201",
      courseName: "Painting Basics",
      facultyName: "Prof. Doe",
      rating: 4,
      comment: "Loved the creativity!",
      semester: 2,
      program: "Fine Arts",
      userSubmitted: true,
      reviewer: { username: "jaya123", program: "Fine Arts", semester: "2" },
      userId: 123,
    },
  ]);

  // Open menu per review card (store open menu review id)
  const [openMenuId, setOpenMenuId] = useState(null);

  // Filter reviews by search and filters
  const filteredReviews = reviews.filter(
    (r) =>
      (!selectedCourse || r.courseName.toLowerCase().includes(selectedCourse.toLowerCase())) &&
      (!selectedSemester || r.semester === selectedSemester) &&
      (!searchTerm || r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Highlight search term helper
  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} style={{ background: "#ffeb3b66", padding: "0 2px" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Reset form fields helper
  const resetForm = () => {
    setFormCourseId("");
    setFormCourseName("");
    setFormFacultyName("");
    setFormSemester(null);
    setFormProgram("");
    setFormRating(0);
    setFormComment("");
    setEditingId(null);
  };

  // Open form for new review
  const openModalForNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing review
  const openModalForEdit = (review) => {
    setFormCourseId(review.courseId);
    setFormCourseName(review.courseName);
    setFormFacultyName(review.facultyName);
    setFormSemester(review.semester);
    setFormProgram(review.program);
    setFormRating(review.rating);
    setFormComment(review.comment);
    setEditingId(review.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenMenuId(null);
  };

  // Submit add/edit form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (
      !formCourseId ||
      !formCourseName ||
      !formFacultyName ||
      !formSemester ||
      !formProgram ||
      formRating === 0 ||
      !formComment
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      // Update existing review
      setReviews(
        reviews.map((r) =>
          r.id === editingId
            ? {
                ...r,
                courseId: formCourseId,
                courseName: formCourseName,
                facultyName: formFacultyName,
                semester: formSemester,
                program: formProgram,
                rating: formRating,
                comment: formComment,
              }
            : r
        )
      );
      alert("Review updated!");
    } else {
      // Add new review
      const newReview = {
        id: Date.now(),
        courseId: formCourseId,
        courseName: formCourseName,
        facultyName: formFacultyName,
        semester: formSemester,
        program: formProgram,
        rating: formRating,
        comment: formComment,
        userSubmitted: true,
        reviewer: { username: "current_user", program: formProgram, semester: formSemester },
        userId: currentUser.id,
      };
      setReviews([newReview, ...reviews]);
      alert("Review submitted anonymously!");
    }
    resetForm();
    setShowForm(false);
  };

  // Delete review
  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
      setOpenMenuId(null);
    }
  };

  // Toggle menu open/close for a review id
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Open reviewer info modal (admin only)
  const openInfoModal = (review) => {
    setInfoReviewer(review.reviewer);
    setShowInfoModal(true);
    setOpenMenuId(null);
  };

  // Shared button style generator
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

  // Form input styling
  const formInputStyle = {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: 15,
    outlineColor: primaryColor,
    boxSizing: "border-box",
    color: primaryColor,
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: primaryColor,
        userSelect: "none",
        minHeight: "100vh",
    
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Reviews</h2>

      {/* Search, Filter, Reset, Upload buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search reviews..."
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
            color: primaryColor,
          }}
        />
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={buttonStyle(primaryColor, primaryHover)}
          onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
          aria-label="Toggle filter panel"
        >
          Filter
        </button>
        <button
          onClick={() => {
            setSelectedCourse("");
            setSelectedSemester(null);
            setSearchTerm("");
          }}
          style={buttonStyle(grayPrimary, grayHover)}
          onMouseEnter={(e) => (e.currentTarget.style.background = grayHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = grayPrimary)}
          aria-label="Reset filters and search"
        >
          Reset
        </button>
        <button
          onClick={openModalForNew}
          style={buttonStyle(primaryColor, primaryHover)}
          onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
          aria-label="Upload new review"
        >
          Upload Review
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
            color: primaryColor,
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong>Course:</strong>{" "}
            <input
              type="text"
              placeholder="Type course..."
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: `1px solid ${primaryColor}`,
                marginLeft: "10px",
                fontSize: 14,
                color: primaryColor,
              }}
              aria-label="Filter by course"
            />
          </div>
          <div>
            <strong>Semester:</strong>{" "}
            {[...Array(8)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setSelectedSemester(i + 1)}
                style={{
                  marginLeft: "5px",
                  padding: "6px 10px",
                  border:
                    selectedSemester === i + 1
                      ? `2px solid ${primaryColor}`
                      : `1px solid ${primaryColor}`,
                  borderRadius: "4px",
                  background: selectedSemester === i + 1 ? "#e6f0ff" : "white",
                  cursor: "pointer",
                  color: primaryColor,
                  fontWeight: selectedSemester === i + 1 ? "700" : "400",
                  userSelect: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e6f0ff";
                  e.currentTarget.style.border = `2px solid ${primaryHover}`;
                  e.currentTarget.style.color = primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    selectedSemester === i + 1 ? "#e6f0ff" : "white";
                  e.currentTarget.style.border =
                    selectedSemester === i + 1
                      ? `2px solid ${primaryColor}`
                      : `1px solid ${primaryColor}`;
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setSelectedSemester(null)}
              style={{
                marginLeft: "5px",
                padding: "6px 10px",
                border: !selectedSemester ? `2px solid ${primaryColor}` : `1px solid ${primaryColor}`,
                borderRadius: "4px",
                background: !selectedSemester ? "#e6f0ff" : "white",
                cursor: "pointer",
                color: primaryColor,
                fontWeight: !selectedSemester ? "700" : "400",
                userSelect: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedSemester) {
                  e.currentTarget.style.background = "#e6f0ff";
                  e.currentTarget.style.border = `2px solid ${primaryHover}`;
                  e.currentTarget.style.color = primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = !selectedSemester ? "#e6f0ff" : "white";
                e.currentTarget.style.border = !selectedSemester ? `2px solid ${primaryColor}` : `1px solid ${primaryColor}`;
                e.currentTarget.style.color = primaryColor;
              }}
              aria-label="Clear semester filter"
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* Reviews grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          color: primaryColor,
        }}
      >
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "15px",
                border: `1px solid ${primaryColor}`,
                borderRadius: "6px",
                boxShadow: "0 1px 5px rgba(28, 46, 74, 0.1)",
                backgroundColor: "white",
                position: "relative",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(28, 46, 74, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 5px rgba(28, 46, 74, 0.1)";
              }}
            >
              {/* Three-dots menu - show if admin OR review is userSubmitted & owned by current user */}
              {(currentUser.role === "admin" ||
                (r.userSubmitted && r.userId === currentUser.id)) && (
                <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                  <button
                    onClick={() => toggleMenu(r.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#666",
                      padding: 0,
                    }}
                    aria-label="Open review options"
                  >
                    ⋮
                  </button>
                  {openMenuId === r.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "24px",
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 10,
                        minWidth: "120px",
                      }}
                      role="menu"
                    >
                      <button
                        onClick={() => openModalForEdit(r)}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: primaryColor,
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        role="menuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#d9534f",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fceaea")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        role="menuitem"
                      >
                        Delete
                      </button>
                      {currentUser.role === "admin" && (
                        <button
                          onClick={() => openInfoModal(r)}
                          style={{
                            display: "block",
                            padding: "8px 12px",
                            width: "100%",
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: primaryColor,
                            userSelect: "none",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          role="menuitem"
                        >
                          View Info
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <h4 style={{ marginBottom: 6 }}>{highlightText(r.courseName, selectedCourse)}</h4>
              <div style={{ marginBottom: 8 }}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < r.rating ? "#fbc02d" : "#ccc",
                      fontSize: "18px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "14px", color: "#555", marginBottom: 10 }}>
                {highlightText(r.comment, searchTerm)}
              </p>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
                <div>
                  <strong>Faculty:</strong> {r.facultyName}
                </div>
                <div>
                  <strong>Program:</strong> {r.program}
                </div>
                <div>
                  <strong>Semester:</strong> {r.semester}
                </div>
                <div>
                  <strong>Course ID:</strong> {r.courseId}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "#777", gridColumn: "1 / -1", userSelect: "none" }}>
            No reviews match your filters.
          </div>
        )}
      </div>

      {/* Modal popup for add/edit */}
      {showForm && (
        <>
          <div
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1000,
            }}
            aria-label="Close review form"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-form-title"
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "90%",
              maxWidth: "450px",
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1001,
              maxHeight: "90vh",
              overflowY: "auto",
              color: primaryColor,
              userSelect: "text",
            }}
          >
            <h3 id="review-form-title" style={{ marginBottom: "15px" }}>
              {editingId ? "Edit Review" : "Submit a Review"}
            </h3>
            <form
              onSubmit={handleSubmitForm}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <input
                type="text"
                placeholder="Course ID"
                value={formCourseId}
                onChange={(e) => setFormCourseId(e.target.value)}
                style={formInputStyle}
                required
                aria-required="true"
                aria-label="Course ID"
              />
              <input
                type="text"
                placeholder="Course Name"
                value={formCourseName}
                onChange={(e) => setFormCourseName(e.target.value)}
                style={formInputStyle}
                required
                aria-required="true"
                aria-label="Course Name"
              />
              <input
                type="text"
                placeholder="Faculty Name"
                value={formFacultyName}
                onChange={(e) => setFormFacultyName(e.target.value)}
                style={formInputStyle}
                required
                aria-required="true"
                aria-label="Faculty Name"
              />
              <input
                type="text"
                placeholder="Program"
                value={formProgram}
                onChange={(e) => setFormProgram(e.target.value)}
                style={formInputStyle}
                required
                aria-required="true"
                aria-label="Program"
              />
              <div aria-label="Select Semester" style={{ userSelect: "none" }}>
                <strong>Semester:</strong>{" "}
                {[...Array(8)].map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => setFormSemester(i + 1)}
                    style={{
                      marginLeft: "5px",
                      padding: "6px 10px",
                      border:
                        formSemester === i + 1
                          ? `2px solid ${primaryColor}`
                          : `1px solid #ccc`,
                      background: formSemester === i + 1 ? "#e6f0ff" : "white",
                      borderRadius: "4px",
                      color: primaryColor,
                      cursor: "pointer",
                      fontWeight: formSemester === i + 1 ? "700" : "400",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e6f0ff";
                      e.currentTarget.style.border = `2px solid ${primaryHover}`;
                      e.currentTarget.style.color = primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        formSemester === i + 1 ? "#e6f0ff" : "white";
                      e.currentTarget.style.border =
                        formSemester === i + 1 ? `2px solid ${primaryColor}` : `1px solid #ccc`;
                      e.currentTarget.style.color = primaryColor;
                    }}
                    aria-pressed={formSemester === i + 1}
                    aria-label={`Select semester ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div aria-label="Select Rating" style={{ userSelect: "none" }}>
                <strong>Rating:</strong>{" "}
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setFormRating(i + 1)}
                    style={{
                      cursor: "pointer",
                      color: i < formRating ? "#fbc02d" : "#ccc",
                      fontSize: "25px",
                      transition: "color 0.2s ease",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fbc02d")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = i < formRating ? "#fbc02d" : "#ccc")
                    }
                    role="radio"
                    aria-checked={i < formRating}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setFormRating(i + 1);
                      }
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Comment"
                rows={4}
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                style={{ ...formInputStyle, resize: "vertical" }}
                required
                aria-required="true"
                aria-label="Comment"
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={buttonStyle(primaryColor, primaryHover, true)}
                  aria-label={editingId ? "Update review" : "Submit review"}
                >
                  {editingId ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  style={buttonStyle(grayPrimary, grayHover, true)}
                  aria-label="Cancel review form"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Reviewer Info Modal (admin only) */}
      {showInfoModal && infoReviewer && (
        <>
          <div
            onClick={() => setShowInfoModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1100,
            }}
            aria-label="Close reviewer info"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reviewer-info-title"
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "90%",
              maxWidth: "350px",
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1101,
              color: primaryColor,
              userSelect: "none",
            }}
          >
            <h3 id="reviewer-info-title" style={{ marginBottom: "15px" }}>
              Reviewer Info
            </h3>
            <div style={{ marginBottom: "10px" }}>
              <strong>Username:</strong> {infoReviewer.username}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Program:</strong> {infoReviewer.program}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Semester:</strong> {infoReviewer.semester}
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              style={buttonStyle(primaryColor, primaryHover, true)}
              aria-label="Close reviewer info modal"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
