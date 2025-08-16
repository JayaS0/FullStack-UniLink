import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import StudentLayout from "./components/StudentLayout";
import FacultyLayout from "./components/FacultyLayout";
import AdminLayout from "./components/AdminLayout";

import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Listings from "./pages/Listings";
import Reviews from "./pages/Reviews";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import UserManagement from "./pages/admin/UserManagement";
import Programs from "./pages/admin/Programs";
import Schools from "./pages/admin/Schools";
import Courses from "./pages/admin/Courses";

export default function App() {
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [assignedPrograms, setAssignedPrograms] = useState([]);

  // Load from localStorage on page load
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedName = localStorage.getItem("username");
    const savedPrograms = JSON.parse(localStorage.getItem("assignedPrograms") || "[]");
    if (savedRole) setUserRole(savedRole);
    if (savedName) setUsername(savedName);
    if (savedPrograms.length) setAssignedPrograms(savedPrograms);
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Login
            setUserRole={setUserRole}
            setUsername={setUsername}
            setAssignedPrograms={setAssignedPrograms}
          />
        }
      />
      <Route
        path="auth/login"
        element={
          <Login
            setUserRole={setUserRole}
            setUsername={setUsername}
            setAssignedPrograms={setAssignedPrograms}
          />
        }
      />
      <Route
        path="/auth/signup"
        element={
          <Signup
            setUserRole={setUserRole}
            setUsername={setUsername}
            setAssignedPrograms={setAssignedPrograms}
          />
        }
      />

      {/* Student Layout Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route
          index
          element={<StudentDashboard username={username} userProgram={assignedPrograms[0]} />}
        />
        <Route path="listings" element={<Listings userRole={userRole} />} />
        <Route path="reviews" element={<Reviews userRole={userRole} />} />
        <Route path="resources" element={<Resources userRole={userRole} />} />
        <Route path="profile" element={<Profile userRole={userRole} />} />
      </Route>

      {/* Faculty Layout Routes */}
      <Route path="/faculty" element={<FacultyLayout />}>
        <Route
          index
          element={<FacultyDashboard username={username} userProgram={assignedPrograms[0]} />}
        />
        <Route path="listings" element={<Listings userRole={userRole} />} />
        <Route path="reviews" element={<Reviews userRole={userRole} />} />
        <Route path="resources" element={<Resources userRole={userRole} />} />
        <Route path="profile" element={<Profile userRole={userRole} />} />
      </Route>

      {/* Admin Layout Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard username={username} />} />
        <Route path="listings" element={<Listings userRole={userRole} />} />
        <Route path="reviews" element={<Reviews userRole={userRole} />} />
        <Route path="resources" element={<Resources userRole={userRole} />} />
        <Route path="profile" element={<Profile userRole={userRole} />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="programs" element={<Programs />} />
        <Route path="schools" element={<Schools />} />
        <Route path="courses" element={<Courses user={{ role: userRole }} />} />
      </Route>
    </Routes>
  );
}
