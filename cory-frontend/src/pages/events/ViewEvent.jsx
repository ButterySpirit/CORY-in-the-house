import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ViewEvent() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
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
  }, [eventId]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading event...</p>;
  if (error) return <p className="text-center text-red-500">⚠️ {error}</p>;
  if (!event) return <p className="text-center text-gray-500">Event not found.</p>;

  const isOrganizer = user && event.User && user.id === event.User.id;

  const getDashboardRoute = () => {
    if (!user) return "/";
    return user.role === "organizer"
      ? "/organizer-dashboard"
      : user.role === "staff"
      ? "/staff-dashboard"
      : "/volunteer-dashboard";
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      {/* 🔹 Back Button */}
      <button
        onClick={() => navigate(getDashboardRoute())}
        className="mb-4 bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900 transition"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h2>
      <p className="text-lg text-gray-700 leading-relaxed">{event.description}</p>
      <div className="mt-5">
        <p className="text-gray-600">
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <strong>Location:</strong> {event.location}
        </p>

        {event.User && (
          <p className="text-gray-600">
            <strong>Organizer:</strong>{" "}
            <Link
              to={`/profile/${event.User.id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {event.User.username}
            </Link>
          </p>
        )}
      </div>

      {/* 🔹 Organizer Actions */}
      {isOrganizer && (
        <div className="mt-6 flex gap-3">
          <Link
            to={`/events/${eventId}/edit`}
            className="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-gray-900 transition"
          >
            ✏️ Edit Event
          </Link>
          <Link
            to={`/events/${eventId}/jobs/create`}
            className="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-gray-900 transition"
          >
            📌 Create Job Posting
          </Link>
        </div>
      )}

      {/* 🔹 View Jobs Button */}
      <div className="mt-6">
        <Link
          to={`/jobPostings/${eventId}/jobs`}
          className="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-gray-900 transition"
        >
          🏆 View Jobs
        </Link>
      </div>
    </div>
  );
}
