import React from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  midnightBlue: "#1C2E4A",
  dustyBlue: "#52677D",
  ivory: "#BDC4D4",
  deepNavy: "#0F1A2B",
  buttercream: "#F5F5F5",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Dummy Data
  const users = [
    { id: 1, name: "Alice", role: "student" },
    { id: 2, name: "Bob", role: "faculty" },
    { id: 3, name: "Charlie", role: "admin" },
  ];

  const listings = [
    { id: 1, title: "Job Opening: Developer", company: "Tech Corp", category: "Job", createdAt: "2025-07-06" },
    { id: 2, title: "Internship: Marketing Intern", company: "Market Masters", category: "Internship", createdAt: "2025-07-05" },
  ];

  const reviews = [
    { id: 1, course: "CS101", reviewer: "Prof. Smith", feedback: "Excellent course!", createdAt: "2025-07-04" },
    { id: 2, course: "FA201", reviewer: "Prof. Doe", feedback: "Loved the creativity!", createdAt: "2025-07-03" },
  ];

  const resources = [
    { id: 1, title: "BBIS Notes 1", program: "BBIS", date: "2025-07-10" },
    { id: 2, title: "BBA Guide 2", program: "BBA", date: "2025-07-11" },
  ];

  // Sort function helper
  const sortByDateDesc = (arr, dateField) =>
    [...arr].sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));

  // Get top 3 recent items
  const recentListings = sortByDateDesc(listings, "createdAt").slice(0, 3);
  const recentReviews = sortByDateDesc(reviews, "createdAt").slice(0, 3);
  const recentResources = sortByDateDesc(resources, "date").slice(0, 3);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: colors.buttercream,
        minHeight: "100vh",
        color: colors.deepNavy,
      }}
    >
      <h2 style={{ color: colors.midnightBlue }}>Welcome, Admin!</h2>
      <p style={{ marginBottom: 30 }}>Here's a quick overview of your system:</p>

      {/* Analytics Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <AnalyticsCard title="Users" value={users.length} onClick={() => navigate("/admin/users")} />
        <AnalyticsCard title="Listings" value={listings.length} onClick={() => navigate("/admin/listings")} />
        <AnalyticsCard title="Reviews" value={reviews.length} onClick={() => navigate("/admin/reviews")} />
        <AnalyticsCard title="Resources" value={resources.length} onClick={() => navigate("/admin/resources")} />
      </div>

      {/* Recently Added Section */}
      <h3 style={{ color: colors.midnightBlue, marginBottom: 15 }}>Recently Added</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        <RecentCard title="Listings" items={recentListings} to="/admin/listings" />
        <RecentCard title="Reviews" items={recentReviews} to="/admin/reviews" />
        <RecentCard title="Resources" items={recentResources} to="/admin/resources" />
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        padding: 20,
        borderRadius: 8,
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      aria-label={`Go to ${title}`}
    >
      <h3 style={{ color: "#1C2E4A", marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 32, margin: 0, color: "#1C2E4A" }}>{value}</p>
    </div>
  );
}

function RecentCard({ title, items, to }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        padding: 15,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ color: "#1C2E4A", margin: 0 }}>{title}</h4>
        <button
          onClick={() => navigate(to)}
          style={{
            background: "#1C2E4A",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: 13,
          }}
          aria-label={`See all ${title}`}
        >
          See all →
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "#52677D" }}>No recent {title.toLowerCase()}.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "8px 10px",
              border: "1px solid #1C2E4A",
              borderRadius: 4,
              fontSize: 14,
              cursor: "pointer",
            }}
            onClick={() => navigate(to)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(to); }}
            aria-label={`Go to ${title}`}
          >
            <strong>{item.title || item.course || "Untitled"}</strong>
            {item.company && <span> — {item.company}</span>}
          </div>
        ))
      )}
    </div>
  );
}
