import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

// Auth & Home
import LandingPage from "../pages/home/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Dashboards
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import VolunteerDashboard from "../pages/dashboard/VolunteerDashboard";

// Events
import ViewEvent from "../pages/events/ViewEvent";
import EventCalendar from "../pages/events/EventCalendar";
import OrganizerEvents from "../pages/events/OrganizerEvents";
import CreateEvent from "../pages/events/CreateEvent";
import EditEvent from "../pages/events/EditEvent";

// Applications
import ViewApplications from "../pages/ViewApplications";

// Jobs
import ViewJobs from "../pages/jobs/ViewJobs";
import CreateJobPosting from "../pages/jobs/CreateJobPosting";
import ApplyForJob from "../pages/jobs/ApplyForJob";
import EditJob from "../pages/jobs/EditJob";

// Profile
import ViewProfile from "../pages/profile/ViewProfile"; // ✅ Import it here

import EditProfile from "../pages/profile/EditProfile"; // ✅ Import it here

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        {/* Wrap all routes in Layout to persist Navbar */}
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Events */}
          <Route path="/events" element={<EventCalendar />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:eventId" element={<ViewEvent />} />
          <Route path="/events/:eventId/edit" element={<EditEvent />} />
          <Route path="/my-events" element={<OrganizerEvents />} />
          <Route path="/events/:eventId/jobs/create" element={<CreateJobPosting />} />

          {/* Jobs */}
          <Route path="/jobPostings/:eventId/jobs" element={<ViewJobs />} />
          <Route path="/jobPostings/:eventId/jobs/:jobId/applications" element={<ViewApplications />} />
          <Route path="/applications/:jobId/apply" element={<ApplyForJob />} />
          <Route path="/jobPostings/:jobId/edit" element={<EditJob />} />

          {/* Profile */}
          <Route path="/profile/:userId" element={<ViewProfile />} /> 
          <Route path="/profile/:userId/edit" element={<EditProfile />} />

          {/* Protected Dashboards */}
          {user ? (
            <>
              <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Route>
      </Routes>
    </Router>
  );
}
