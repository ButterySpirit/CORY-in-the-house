import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import UpcomingEventsList from "../../components/UpcomingEventsList";
import RecentApplicationsList from "../../components/RecentApplicationsList";
import "../../styles/organizerDashboard.css";
import Navbar from "../../components/Navbar";

export default function OrganizerDashboard() {
  const [eventCount, setEventCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        // ✅ Fetch Organizer's Events Count
        const eventsRes = await fetch("http://localhost:3000/events/my-events", { credentials: "include" });
        const eventsData = await eventsRes.json();
        setEventCount(eventsData.length);

        // ✅ Fetch Job Applications Count
        const applicationsRes = await fetch("http://localhost:3000/jobApplications", { credentials: "include" });
        const applicationsData = await applicationsRes.json();
        setApplicationCount(applicationsData.length);
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      {/* ✅ Overview Cards */}
      <div className="dashboard-overview">
        <DashboardCard title="Total Events" count={eventCount} />
        <DashboardCard title="Total Applications" count={applicationCount} />
      </div>

      {/* ✅ Upcoming Events */}
      <div className="dashboard-content">
        <UpcomingEventsList />
        <RecentApplicationsList />
      </div>

      {/* ✅ Floating "Create Event" Button */}
      <Link to="/create-event" className="floating-button">+ Create Event</Link>
    </div>
  );
}