import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateJobPosting() {
  const { id } = useParams(); // ✅ Get Event ID from URL
  const { user } = useAuth(); // ✅ Get logged-in user
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("volunteer"); // Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Ensure user is an organizer
    if (!user || user.role !== "organizer") {
      setError("Unauthorized: Only event organizers can create job postings.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/jobPostings/${id}/jobs/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Job posting created successfully!");
        setTimeout(() => navigate(`/events/${id}`), 2000); // Redirect to event page
      } else {
        setError(data.error || "Failed to create job posting.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Job Posting</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
          required
        ></textarea>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="volunteer">Volunteer</option>
          <option value="staff">Staff</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Create Job Posting
        </button>
      </form>
    </div>
  );
}
