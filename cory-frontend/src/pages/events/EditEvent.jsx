import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EditEvent() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch Existing Event Details
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${await res.text()}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!user || user.id !== data.User.id) {
          setError("Access Denied. You cannot edit this event.");
          setLoading(false);
          return;
        }
        setEventData({
          title: data.title,
          description: data.description,
          date: data.date.split("T")[0], // Format Date for Input Field
          location: data.location,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [eventId, user]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Event updated successfully!");
        setTimeout(() => navigate(`/events/${eventId}`), 1500);
      } else {
        setError(data.error || "Failed to update event.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  // ✅ Handle Delete Event
const handleDelete = async () => {
    const confirmDelete = window.confirm("❗ Are you sure you want to delete this event?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (response.ok) {
        alert("✅ Event deleted successfully!");
        navigate("/organizer-dashboard"); // ✅ Redirect to dashboard
      } else {
        throw new Error("Failed to delete event.");
      }
    } catch (err) {
      alert("❌ Server error. Could not delete event.");
    }
  };
  

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading event...</p>;
  if (error) return <p className="text-center text-red-500">⚠️ {error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 w-96 shadow-xl bg-white rounded-lg">
        <h2 className="text-center mb-4 font-bold text-gray-900">Edit Event</h2>

        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            Save Changes
          </button>

        </form>
        <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-800 transition"
          >
            Delete Event
          </button>
      </div>
    </div>
  );
}
