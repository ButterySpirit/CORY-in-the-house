import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/home/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";
import ViewApplications from "../pages/ViewApplications"; // ✅ Added this if needed

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>; // ✅ Prevents flashing before auth loads
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Require Auth) */}
        {user ? (
          <>
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            <Route path="/applications" element={<ViewApplications />} />
          </>
        ) : (
          <>
            <Route path="/organizer-dashboard" element={<Navigate to="/login" />} />
            <Route path="/staff-dashboard" element={<Navigate to="/login" />} />
            <Route path="/volunteer-dashboard" element={<Navigate to="/login" />} />
            <Route path="/applications" element={<Navigate to="/login" />} />
          </>
        )}

        {/* Catch All: Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
