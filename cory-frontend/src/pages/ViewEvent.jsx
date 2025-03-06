import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ViewEvent() {
  const { id } = useParams();
  const { user } = useAuth(); // Get logged-in user
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 🔹 Handle errors properly

  useEffect(() => {
    fetch(`http://localhost:3000/events/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Server error: ${res.status} ${errorMessage}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch event:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;
  if (!event) return <p>Event not found.</p>;

  // 🔹 Check if the logged-in user is the event organizer
  const isOrganizer = user && event.User && user.id === event.User.id;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
      <p className="text-gray-700">{event.description}</p>
      <p className="text-gray-600 mt-2">
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        <strong>Location:</strong> {event.location}
      </p>
      {event.User ? (
        <p className="text-gray-600">
          <strong>Organizer:</strong> {event.User.username}
        </p>
      ) : (
        <p className="text-red-500">⚠️ Organizer information unavailable</p>
      )}

      {/* 🔹 Buttons for Organizer */}
      {isOrganizer && (
        <div className="mt-4 space-x-2">
          <Link to={`/events/${id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit Event
          </Link>
          <Link to={`/events/${id}/jobs/create`} className="bg-green-500 text-white px-4 py-2 rounded">
            Create Job Posting
          </Link>
          <Link to={`/events/${id}/applications`} className="bg-purple-500 text-white px-4 py-2 rounded">
            View Applications
          </Link>
        </div>
      )}

      {/* 🔹 View Jobs (Correctly Linked to `ViewJobs.jsx`) */}
      <div className="mt-4">
        <Link to={`/jobPostings/${id}/jobs`} className="bg-gray-500 text-white px-4 py-2 rounded">
          View Jobs
        </Link>
      </div>
    </div>
  );
}
