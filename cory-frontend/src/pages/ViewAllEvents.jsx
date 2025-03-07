import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ViewAllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/events") // ✅ Correct API call
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch events:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;
  if (events.length === 0) return <p>No events available.</p>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>

      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Organizer:</strong> {event.User?.username || "Unknown"}
            </p>

            <Link
              to={`/events/${event.id}`}
              className="text-blue-500 underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
