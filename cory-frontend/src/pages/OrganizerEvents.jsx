import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function OrganizerEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "organizer") return;

    fetch("http://localhost:3000/events/my-events", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Loading events...</p>;
  if (!user || user.role !== "organizer") return <p>Access denied.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Created Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="p-4 border rounded-lg hover:bg-gray-100 transition">
              {/* 🔹 Clicking event title navigates to /events/:id */}
              <Link to={`/events/${event.id}`} className="text-lg font-semibold text-blue-500 hover:underline">
                {event.title}
              </Link>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-gray-500">
                {new Date(event.date).toLocaleDateString()} - {event.location}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
