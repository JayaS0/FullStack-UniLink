import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showRoles, setShowRoles] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!email.endsWith("@ku.edu.np") && !email.endsWith("@kusom.edu.np")) {
    alert("Only KU emails allowed!");
    return;
  }

  const userData = JSON.parse(localStorage.getItem("currentUser"));
  if (!userData || userData.email !== email) {
    alert("User not found! Please sign up first.");
    return;
  }

  // For demo, store login flag and role
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", userData.role);

  alert("Logged in successfully!");

  if (userData.role === "student") navigate("/student");
  else if (userData.role === "faculty") navigate("/faculty");
  else if (userData.role === "admin") navigate("/admin");
};


  const handleForgotSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email!");
    setShowForgot(false);
    setForgotEmail("");
  };

  const roles = ["admin", "faculty", "student"];

  return (
    <>
      <div
        style={{
          height: "100vh",
          background: "#D1CFC9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px 30px 30px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: 420,
            position: "relative",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: 10,
              color: "#1C2E4A",
              fontWeight: "700",
              fontSize: 32,
              userSelect: "none",
            }}
          >
            UniLink
          </h1>
          <h2
            style={{
              textAlign: "center",
              marginBottom: 25,
              color: "#333",
              fontWeight: "600",
            }}
          >
            Log In
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="email"
              placeholder="Enter your KU email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            {/* Password with show/hide */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 70 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={showHideBtnStyle}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Role dropdown */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setShowRoles((v) => !v)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  userSelect: "none",
                }}
              >
                <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <span style={{ fontSize: 12 }}>▼</span>
              </button>
              {showRoles && (
                <div style={dropdownStyle}>
                  {roles.map((r) => (
                    <div
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoles(false);
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#dbe9f4")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      style={dropdownItemStyle}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button type="submit" style={btnStyle}>
              Log In
            </button>

            {/* Remember Me and Forgot Password side by side */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                userSelect: "none",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ marginRight: 8, cursor: "pointer" }}
                />
                Remember Me
              </label>

              <div
                onClick={() => setShowForgot(true)}
                style={{ ...linkStyle, margin: 0 }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter") setShowForgot(true);
                }}
              >
                Forgot Password?
              </div>
            </div>
          </form>

          {/* Sign Up Link */}
          <div style={{ marginTop: 15, textAlign: "center" }}>
            <span>Don't have an account? </span>
            <button
              onClick={() => navigate("/signup")}
              style={{ ...linkStyle, display: "inline-block", padding: 0, marginLeft: 5 }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={modalOverlayStyle} onClick={() => setShowForgot(false)}>
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgotPasswordTitle"
          >
            <h3 id="forgotPasswordTitle" style={{ marginBottom: 20, color: "#1C2E4A" }}>
              Reset Password
            </h3>
            <form onSubmit={handleForgotSubmit}>
              <input
                type="email"
                placeholder="Enter your KU email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={{ ...inputStyle, marginBottom: 20 }}
              />
              <button type="submit" style={btnStyle}>
                Send Reset Link
              </button>
            </form>
            <button
              onClick={() => setShowForgot(false)}
              style={{ ...btnStyle, backgroundColor: "#ccc", color: "#444", marginTop: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  marginBottom: "15px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#1C2E4A",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 18,
  fontWeight: "600",
  cursor: "pointer",
  userSelect: "none",
  transition: "background-color 0.3s ease",
  outline: "none",
};

const showHideBtnStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#1C2E4A",
  fontWeight: "600",
  fontSize: 14,
  cursor: "pointer",
  userSelect: "none",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: 8,
  marginTop: 4,
  zIndex: 10,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  maxHeight: 140,
  overflowY: "auto",
};

const dropdownItemStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  userSelect: "none",
  transition: "background-color 0.2s ease",
};

const linkStyle = {
  color: "#1C2E4A",
  cursor: "pointer",
  textDecoration: "underline",
  marginTop: 15,
  userSelect: "none",
  fontWeight: "600",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: 30,
  borderRadius: 12,
  width: "90%",
  maxWidth: 400,
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  position: "relative",
};
