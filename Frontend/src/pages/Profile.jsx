import { useEffect, useState, useRef } from "react";
import { getData, putData, uploadFormData } from "../api/api";

export default function StudentProfile() {
  const fileInputRef = useRef(null);

  // Profile data states (mock or load from API)
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // UI states
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Initial load: fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getData("profile");
        const user = res?.data;
        if (user) {
          setUsername(user.username || "");
          setEmail(user.email || "");
          setRole(user.role || "");
          setProfilePic(user.profilePic ? prefixUploadUrl(user.profilePic) : null);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const prefixUploadUrl = (relative) => {
    const origin = (process.env.API_URL || "").replace(/\/api$/, "");
    return relative?.startsWith("http") ? relative : origin + relative;
  };

  // Handle profile pic upload (to backend)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const form = new FormData();
      form.append("profilePic", file);
      const res = await uploadFormData("profile/picture", form);
      const url = res?.data?.profilePic;
      if (url) {
        setProfilePic(prefixUploadUrl(url));
      }
      setShowPicOptions(false);
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      alert(err.response?.data?.message || "Failed to upload profile picture");
    }
  };

  const handleRemovePhoto = () => {
    setProfilePic(null);
    setShowPicOptions(false);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Password change submit (frontend only)
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      await putData("profile/password", { oldPassword, newPassword, confirmPassword });
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      console.error("Password change failed:", err);
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "30px auto",
        padding: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        borderRadius: 12,
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30, color: "#333" }}>
        Profile
      </h2>

      {/* Profile Picture */}
      <div style={{ textAlign: "center", marginBottom: 10, position: "relative" }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            backgroundImage: profilePic ? `url(${profilePic})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: "0 auto",
            border: "2px solid #1C2E4A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#777",
            userSelect: "none",
          
          }}
          title="Profile Photo"
        >
          {!profilePic && "No Photo"}
        </div>

        {/* Change Profile Picture link */}
        <button
          onClick={() => setShowPicOptions((v) => !v)}
          style={{
            marginTop: 8,
            background: "none",
            border: "none",
            color: "#1C2E4A",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          {showPicOptions ? "Cancel" : profilePic ? "Change Photo" : "Add Photo"}
        </button>

        {showPicOptions && (
          <div
            style={{
              marginTop: 10,
            }}
          >
            <button onClick={openFileDialog} style={optionBtnStyle}>
              Upload Photo
            </button>
            {profilePic && (
              <button onClick={handleRemovePhoto} style={{ ...optionBtnStyle, backgroundColor: "#e53935" }}>
                Remove Photo
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>

      {/* Read-only Profile Details */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Username:</label>
        <div style={displayTextStyle}>{username}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Email:</label>
        <div style={displayTextStyle}>{email}</div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <label style={labelStyle}>Role:</label>
        <div style={displayTextStyle}>{role.charAt(0).toUpperCase() + role.slice(1)}</div>
      </div>

      {/* Change Password Link */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            background: "none",
            border: "none",
            color: "#1C2E4A",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 16,
            textDecoration: "underline",
          }}
        >
          Change Password
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={modalOverlayStyle} onClick={() => setShowPasswordModal(false)}>
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#333" }}>Change Password</h3>
            <form onSubmit={submitPasswordChange} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div>
                <label style={labelStyle}>Old Password:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label style={labelStyle}>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ ...mainBtnStyle, backgroundColor: "#ccc", color: "#444" }}>
                  Cancel
                </button>
                <button type="submit" style={mainBtnStyle}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const mainBtnStyle = {
  padding: "12px 28px",
  backgroundColor: "#1C2E4A",
  border: "none",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: "600",
  transition: "background-color 0.3s ease",
  userSelect: "none",
};

const optionBtnStyle = {
  display: "block",
  width: "100%",
  padding: "8px 0",
  
  backgroundColor: "#1C2E4A",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: 15,
  transition: "background-color 0.3s ease",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 15,
  boxSizing: "border-box",
  transition: "border-color 0.3s ease",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: "600",
  color: "#444",
};

const displayTextStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  backgroundColor: "#f5f5f5",
  border: "1px solid #ddd",
  color: "#555",
  minHeight: 40,
  display: "flex",
  alignItems: "center",
  fontSize: 15,
  userSelect: "none",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
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
