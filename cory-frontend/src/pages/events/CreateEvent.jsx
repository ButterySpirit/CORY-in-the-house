import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Get user from context
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Update Input State
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventData, organizerId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Event created successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.error || "Failed to create event.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  // ✅ Restrict Access to Organizers
  if (!user || user.role !== "organizer") {
    return <p className="text-red-500 text-center mt-10">Access Denied. Only organizers can create events.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 w-96 shadow-xl bg-white rounded-lg">
        <h2 className="text-center mb-4 font-bold text-gray-900">Create Event</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={eventData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
