
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../api/api"; // adjust path if needed

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

  const roles = ["admin", "faculty", "student"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@ku.edu.np") && !email.endsWith("@kusom.edu.np")) {
      alert("Only KU emails allowed!");
      return;
    }

    try {
      const result = await postData("auth/login", { email, password, role });
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      alert("Logged in successfully!");

      if (result.data.user.role === "student") navigate("/student");
      else if (result.data.user.role === "faculty") navigate("/faculty");
      else if (result.data.user.role === "admin") navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to your email!");
    setShowForgot(false);
    setForgotEmail("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#D1CFC9", padding: 20 }}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>UniLink</h1>
        <h2 style={subTitleStyle}>Log In</h2>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>KU Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              type={showPassword ? "text" : "password"}
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

          <label style={labelStyle}>Role</label>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <button type="button" onClick={() => setShowRoles(!showRoles)} style={dropdownBtnStyle}>
              <span>{role}</span> <span style={{ fontSize: 12 }}>▼</span>
            </button>
            {showRoles && (
              <div style={dropdownStyle}>
                {roles.map((r) => (
                  <div
                    key={r}
                    onClick={() => { setRole(r); setShowRoles(false); }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dbe9f4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    style={dropdownItemStyle}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
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
              onKeyDown={(e) => { if(e.key === "Enter") setShowForgot(true); }}
            >
              Forgot Password?
            </div>
          </div>

          <button type="submit" style={btnStyle}>Log In</button>
        </form>

        {/* Sign Up Link */}
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate("/auth/signup")}
            style={{ ...linkStyle, display: "inline-block", padding: 0, marginLeft: 5 }}
          >
            Sign Up
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div style={modalOverlayStyle} onClick={() => setShowForgot(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <h3 style={{ marginBottom: 20, color: "#1C2E4A" }}>Reset Password</h3>
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  placeholder="Enter KU email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, marginBottom: 20 }}
                />
                <button type="submit" style={btnStyle}>Send Reset Link</button>
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
      </div>
    </div>
  );
}

// ⬇️ Styles
const containerStyle = { maxWidth: 600, margin: "50px auto", padding: 30, boxShadow: "0 5px 15px rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "white", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
const titleStyle = { textAlign: "center", marginBottom: 10, color: "#1C2E4A", fontWeight: "700", fontSize: 32 };
const subTitleStyle = { textAlign: "center", marginBottom: 30, color: "#333", fontWeight: "600" };
const labelStyle = { fontWeight: "600", marginBottom: 6, display: "block", color: "#444" };
const inputStyle = { width: "100%", padding: "12px 16px", marginBottom: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, outline: "none", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "14px", backgroundColor: "#1C2E4A", color: "white", border: "none", borderRadius: 8, fontSize: 18, fontWeight: "600", cursor: "pointer" };
const dropdownStyle = { position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "white", border: "1px solid #ccc", borderRadius: 8, marginTop: 4, zIndex: 10, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
const dropdownItemStyle = { padding: "10px 15px", cursor: "pointer", userSelect: "none" };
const dropdownBtnStyle = { ...inputStyle, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white" };
const showHideBtnStyle = { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#1C2E4A", fontWeight: "600", fontSize: 14, cursor: "pointer" };
const linkStyle = { color: "#1C2E4A", cursor: "pointer", textDecoration: "underline", marginTop: 15, userSelect: "none", fontWeight: "600" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContentStyle = { backgroundColor: "white", padding: 30, borderRadius: 12, width: "90%", maxWidth: 400, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", position: "relative" };
