import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/home/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Role-Based Dashboard Navigation */}
        {user ? (
          <>
            {user.role === "organizer" && <Route path="/dashboard" element={<OrganizerDashboard />} />}
            {user.role === "staff" && <Route path="/dashboard" element={<StaffDashboard />} />}
            {user.role === "volunteer" && <Route path="/dashboard" element={<VolunteerDashboard />} />}
          </>
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}
