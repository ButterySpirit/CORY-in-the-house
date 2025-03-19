import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/organizerDashboard.css"; // ✅ Ensure the correct CSS file is used

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("🔍 Fetching Dashboard Data...");
        
        const [eventsRes] = await Promise.all([
          fetch("http://localhost:3000/events/my-events", { credentials: "include" }),
        ]);
  
        const eventsText = await eventsRes.text();
  
        console.log("🔍 Raw Events Response:", eventsText);
  
        if (!eventsRes.ok) {
          throw new Error("Failed to load dashboard data");
        }
  
        // ✅ Try parsing as JSON
        const eventsData = JSON.parse(eventsText);
  
        console.log("✅ Events Data:", eventsData);
  
        setEvents(eventsData);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;

  return (
    <box>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Organizer Dashboard</h2>

        {/* ✅ Create Event Button */}
        <div className="dashboard-section">
          <Link to="/create-event" className="create-event-btn">
            + Create New Event
          </Link>
        </div>

        {/* ✅ Upcoming Events */}
        <div className="dashboard-section">
          <h3>Upcoming Events</h3>
          <ul>
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event.id} className="dashboard-card">
                  <p><strong>{event.title}</strong></p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <Link to={`/events/${event.id}`} className="view-details-btn">
                    View Event
                  </Link>
                </li>
              ))
            ) : (
              <p>No upcoming events.</p>
            )}
          </ul>
        </div>
      </div>
    </box>
  );
}
