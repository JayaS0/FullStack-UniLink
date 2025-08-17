import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../api/api";

const colors = {
  midnightBlue: "#1C2E4A",
  dustyBlue: "#52677D",
  ivory: "#BDC4D4",
  deepNavy: "#0F1A2B",
  buttercream: "#F5F5F5",
};

export default function FacultyDashboard({ username, userProgram }) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Listings (all)
        const listingsRes = await getData("listings");
        setListings((listingsRes?.data || []).map((l) => ({
          id: l._id,
          title: l.title,
          company: l.company,
          category: l.category,
          date: l.createdAt || new Date().toISOString(),
        })));

        // Reviews (role-based)
        const reviewsRes = await getData("reviews");
        setReviews((reviewsRes?.data || []).map((r) => ({
          id: r._id,
          courseName: r.courseName,
          comment: r.comment,
          facultyName: r.facultyName,
          program: r.program,
          date: r.createdAt || new Date().toISOString(),
        })));

        // Resources for first assigned program
        const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        const firstProgram = savedUser?.programs?.[0] || savedUser?.program;
        if (firstProgram) {
          const resourcesRes = await getData(`resources/${firstProgram}`);
          setResources((resourcesRes?.data || []).map((r) => ({
            id: r._id,
            title: r.title,
            program: r.program,
            semester: r.semester,
            course: r.relatedCourse,
            date: r.createdAt || new Date().toISOString(),
            uploadedBy: r.uploadedBy?.username || "Unknown",
          })));
        }
      } catch (error) {
        console.error("Failed to load faculty dashboard:", error);
      }
    };
    fetchAll();
  }, []);

  const sortByDateDesc = (arr) => [...arr].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  return (
    <div style={{ maxWidth: 1100, margin: "auto", padding: 20, minHeight: "100vh", fontFamily: "Segoe UI, sans-serif", color: colors.deepNavy }}>
      <h2 style={{ color: colors.midnightBlue }}>Welcome, {username}!</h2>
      <p>Your program: <strong>{userProgram || "N/A"}</strong></p>

      <h3 style={{ color: colors.midnightBlue, marginTop: 30 }}>Recently Added</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginTop: 20 }}>
        <RecentCard
          title="Listings"
          to="/faculty/listings"
          items={sortByDateDesc(listings)}
          renderItem={(item) => (
            <>
              <strong>{item.title}</strong>
              <p style={{ color: colors.dustyBlue, fontSize: 14 }}>{item.company} • {item.category} • {new Date(item.date).toLocaleDateString()}</p>
            </>
          )}
        />

        <RecentCard
          title="Reviews"
          to="/faculty/reviews"
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
          to="/faculty/resources"
          items={sortByDateDesc(resources)}
          renderItem={(item) => (
            <>
              <strong>{item.title}</strong>
              <p style={{ color: colors.dustyBlue, fontSize: 14 }}>{item.program} • Semester {item.semester} • {item.course}</p>
              <p style={{ fontSize: 12, color: colors.dustyBlue }}>Uploaded by {item.uploadedBy} on {new Date(item.date).toLocaleDateString()}</p>
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
      style={{ background: "white", borderRadius: 8, padding: 15, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}
      onClick={() => navigate(to)}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ color: "#1C2E4A", margin: 0 }}>{title}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(to); }}
          style={{ background: "#1C2E4A", color: "white", border: "none", borderRadius: 4, padding: "5px 10px", fontSize: 13 }}
        >
          See all →
        </button>
      </div>
      {items.length === 0
        ? <p style={{ color: "#52677D" }}>No recent {title.toLowerCase()}.</p>
        : items.map((item) => (
            <div key={item.id}>{renderItem(item)}</div>
          ))}
    </div>
  );
}
