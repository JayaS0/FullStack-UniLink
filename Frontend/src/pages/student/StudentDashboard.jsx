import React from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  midnightBlue: "#1C2E4A",
  dustyBlue: "#52677D",
  ivory: "#BDC4D4",
  deepNavy: "#0F1A2B",
  buttercream: "#F5F5F5",
};

export default function StudentDashboard({ username, userProgram }) {
  const navigate = useNavigate();

  // Dummy data
  const listings = [
    { id: 1, title: "Job: Developer", company: "Tech Corp", category: "Job", date: "2025-07-10" },
    { id: 2, title: "Intern: Marketing", company: "Market Masters", category: "Internship", date: "2025-07-09" },
  ];

  const reviews = [
    { id: 1, courseName: "CS101", comment: "Great course!", facultyName: "Prof. Smith", date: "2025-07-08" },
    { id: 2, courseName: "FA201", comment: "Informative", facultyName: "Prof. Doe", date: "2025-07-07" },
  ];

  const resources = [
    { id: 1, title: "BBIS Notes", program: "BBIS", semester: 1, course: "Intro to IT", date: "2025-07-10", uploadedBy: "John Doe" },
    { id: 2, title: "BBA Guide", program: "BBA", semester: 2, course: "Marketing 101", date: "2025-07-11", uploadedBy: "Jane Smith" },
  ];

  const sortByDateDesc = (arr) => [...arr].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  return (
    <div style={{ maxWidth: 1100, margin: "auto", padding: 20, minHeight: "100vh", fontFamily: "Segoe UI, sans-serif", color: colors.deepNavy }}>
      <h2 style={{ color: colors.midnightBlue }}>Welcome, {username}!</h2>
      <p>Your program: <strong>{userProgram || "N/A"}</strong></p>

      <h3 style={{ color: colors.midnightBlue, marginTop: 30 }}>Recently Added</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginTop: 20 }}>
        <RecentCard
          title="Listings"
          to="/student/listings"
          items={sortByDateDesc(listings)}
          renderItem={(item) => (
            <>
              <strong>{item.title}</strong>
              <p style={{ color: colors.dustyBlue, fontSize: 14 }}>
                {item.company} • {item.category} • {new Date(item.date).toLocaleDateString()}
              </p>
            </>
          )}
        />

        <RecentCard
          title="Reviews"
          to="/student/reviews"
          items={sortByDateDesc(reviews)}
          renderItem={(item) => (
            <>
              <strong>{item.courseName}</strong>
              <p style={{ color: colors.dustyBlue, fontSize: 14 }}>"{item.comment}" • {item.facultyName}</p>
              <p style={{ color: colors.dustyBlue, fontSize: 12 }}>{new Date(item.date).toLocaleDateString()}</p>
            </>
          )}
        />

        <RecentCard
          title="Resources"
          to="/student/resources"
          items={sortByDateDesc(resources)}
          renderItem={(item) => (
            <>
              <strong>{item.title}</strong>
              <p style={{ color: colors.dustyBlue, fontSize: 14 }}>
                {item.program} • Semester {item.semester} • {item.course}
              </p>
              <p style={{ fontSize: 12, color: colors.dustyBlue }}>
                Uploaded by {item.uploadedBy} on {new Date(item.date).toLocaleDateString()}
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}

function RecentCard({ title, items, to, renderItem }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        padding: 15,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
      onClick={() => navigate(to)}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ color: "#1C2E4A", margin: 0 }}>{title}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(to); }}
          style={{
            background: "#1C2E4A",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "5px 10px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          See all →
        </button>
      </div>
      {items.length === 0 ? (
        <p style={{ color: "#52677D" }}>No recent {title.toLowerCase()}.</p>
      ) : (
        items.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))
      )}
    </div>
  );
}
