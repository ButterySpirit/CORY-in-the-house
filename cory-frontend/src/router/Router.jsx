import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/home/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";
import ViewApplications from "../pages/ViewApplications";
import OrganizerEvents from "../pages/events/OrganizerEvents"; // ✅ Import new page
import EventCalendar from "../pages/events/EventCalendar"; // ✅ Import new page
import ViewEvent from "../pages/events/ViewEvent"; // ✅ View specific event

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/:eventId" element={<ViewEvent />} /> {/* ✅ View event details */}
        <Route path="/events" element={<EventCalendar />} /> {/* ✅ All events */}
        <Route path="/my-events" element={<OrganizerEvents />} /> {/* ✅ Organizer's events */}

        {user ? (
          <>
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            <Route path="/applications" element={<ViewApplications />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}
