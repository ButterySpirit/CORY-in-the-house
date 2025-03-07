import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ApplyForJob() {
  const { jobId } = useParams(); // Get Job ID from URL
  const { user } = useAuth(); // Logged-in user
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);

    try {
      const res = await fetch(`http://localhost:3000/applications/${jobId}/apply`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");

      setSuccess(true);
      setTimeout(() => navigate(-1), 2000); // Redirect back to the previous page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">✅ Application submitted! Redirecting...</p>}

      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label className="block font-semibold">Cover Letter</label>
          <textarea
            className="w-full border p-2 rounded"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Resume (PDF Only)</label>
          <input
            type="file"
            accept="application/pdf"
            className="border p-2 rounded w-full"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
}
