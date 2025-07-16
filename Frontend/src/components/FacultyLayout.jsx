import { Outlet, useNavigate, useLocation } from "react-router-dom";

const colors = {
  midnightBlue: "#1C2E4A",
  dustyBlue: "#52677D",
  ivory: "#BDC4D4",
  deepNavy: "#0F1A2B",
  buttercream: "#D1CFC9",
};

export default function FacultyLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/faculty") return location.pathname === "/faculty";
    return location.pathname.startsWith(path);
  };

  const linkStyle = (active) => ({
    background: "none",
    border: "none",
    color: colors.ivory,
    fontSize: "16px",
    cursor: "pointer",
    borderBottom: active ? `2px solid ${colors.ivory}` : "none",
    paddingBottom: "2px",
    transition: "0.3s",
  });

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          background: colors.deepNavy,
          color: colors.ivory,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        {/* Left Logo */}
        <div
          onClick={() => navigate("/faculty")}
          style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer" }}
        >
          UniLink
        </div>

        {/* Middle Links */}
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { name: "Home", path: "/faculty" },
            { name: "Listings", path: "/faculty/listings" },
            { name: "Reviews", path: "/faculty/reviews" },
            { name: "Resources", path: "/faculty/resources" },
          ].map((item) => (
            <button
              key={item.path}
              style={linkStyle(isActive(item.path))}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Right Profile + Logout */}
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            style={{
              ...linkStyle(isActive("/faculty/profile")),
              background: "rgba(189,196,212,0.2)",
              borderRadius: "6px",
              padding: "6px 12px",
              color: colors.ivory,
            }}
            onClick={() => navigate("/faculty/profile")}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: colors.ivory,
              color: colors.deepNavy,
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: "30px", background: colors.buttercream, minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
