import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import EventList from "../../components/EventList"; // ✅ Import the reusable EventList component
import "../../styles/organizerDashboard.css"; // ✅ Ensure the correct CSS file is used

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "organizer") return;

    const fetchEvents = async () => {
      try {
        console.log("🔍 Fetching Organizer's Events...");
        const response = await fetch("http://localhost:3000/events/my-events", {
          credentials: "include",
        });

        const data = await response.json();
        console.log("✅ Fetched Events:", data);

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        setEvents(data);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Could not load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  if (loading) return <p className="text-center mt-4">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">My Dashboard</h2>
        {/* ✅ Upcoming Events Section */}
        <div className="dashboard-section">
          <h3>My Events</h3>
          <EventList events={events} /> {/* ✅ Use EventList for displaying events */}
        </div>
      </div>
    </div>
  );
}
