// src/pages/dashboard/VolunteerDashboard.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import EventList from "../../components/EventList";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "volunteer") return;

    const fetchDashboardData = async () => {
      try {
        const [eventsRes, appsRes] = await Promise.all([
          fetch("http://localhost:3000/events", { credentials: "include" }),
          fetch("http://localhost:3000/applications/my-applications", { method: "GET", credentials: "include" }),
        ]);

        const eventsData = await eventsRes.json();
        const appsData = await appsRes.json();

        if (!eventsRes.ok || !appsRes.ok) throw new Error("Failed to load dashboard data");

        setEvents(eventsData);
        setApplications(appsData);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user || user.role !== "volunteer") return <p className="text-center mt-10 text-red-500">Access denied</p>;
  if (loading) return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.username} 👋</h1>

      {/* 🔹 Upcoming Events Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Link to="/events" className="text-sm text-blue-600 hover:underline">
            View All Events
          </Link>
        </div>
        <EventList events={events.slice(0, 3)} />
      </section>

      {/* 🔹 My Applications Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">My Volunteering Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li key={app.id} className="border rounded p-4 shadow">
                <p className="font-medium">{app.JobPosting.title}</p>
                <p className="text-sm text-gray-600">{app.JobPosting.description}</p>
                <p className="text-sm text-gray-500">
                  Role: {app.JobPosting.role} • Status:{" "}
                  <span className="capitalize">{app.status}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
