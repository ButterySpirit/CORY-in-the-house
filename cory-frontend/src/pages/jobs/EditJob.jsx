import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EditJob() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    role: "volunteer",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch Job Data
  useEffect(() => {
    fetch(`http://localhost:3000/jobPostings/${jobId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then((data) => {
        setJob({
          title: data.title,
          description: data.description,
          role: data.role,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [jobId]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // ✅ Submit Updated Job to /jobPostings/:jobId/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`http://localhost:3000/jobPostings/${jobId}/edit`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Job updated!");
        setTimeout(() => navigate(-1), 1500);
      } else {
        setError(data.error || "Failed to update job.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading job...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Job Posting</h2>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="4"
          required
        />

        <select
          name="role"
          value={job.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="volunteer">Volunteer</option>
          <option value="staff">Staff</option>
        </select>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
