import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateEvent from "./pages/CreateEvent"; 
import OrganizerEvents from "./pages/OrganizerEvents"; 
import ViewEvent from "./pages/ViewEvent";
import ViewJobs from "./pages/ViewJobs";
import CreateJobPosting from "./pages/CreateJobPosting"; 
import ViewAllEvents from "./pages/ViewAllEvents"; 
import ApplyForJob from "./pages/ApplyForJob"; 
import ViewApplications from "./pages/ViewApplications"; // Import the page

export default function AppRouter() {
  return (
    <Router>
      {/* ✅ Navbar is always at the top */}
      <Navbar />

      {/* ✅ Page content is below the Navbar */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-events" element={<OrganizerEvents />} />
          <Route path="/events/:id" element={<ViewEvent />} />
          
          {/* ✅ Job Posting Routes */}
          <Route path="/jobPostings/:id/jobs" element={<ViewJobs />} /> {/* ✅ View Jobs for an Event */}
          <Route path="/events/:id/jobs/create" element={<CreateJobPosting />} /> {/* ✅ Create Job Posting */}
          <Route path="/events" element={<ViewAllEvents />} /> {/* ✅ Add this */}
          <Route path="/jobPostings/:id/jobs/:jobId/apply" element={<ApplyForJob />} /> {/* ✅ Add this */}
          <Route path="/jobPostings/:id/jobs/:jobId/applications" element={<ViewApplications />} />


        </Routes>
      </main>
    </Router>
  );
}
