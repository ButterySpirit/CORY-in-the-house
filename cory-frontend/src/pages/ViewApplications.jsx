import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ViewApplications() {
  const { jobId } = useParams(); // Get job ID from URL
  const { user } = useAuth(); // Logged-in user (organizer)
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      setError("You do not have permission to view applications.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/applications/${jobId}/applications`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("🔹 API Response:", data);
        setApplications(data); // Set applications array
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch applications:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [jobId, user]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;
  if (!applications || applications.length === 0) return <p>No applications yet.</p>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>

      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Applicant: {app.applicant?.username || "Unknown"}</h3>
            <p className="text-gray-600"><strong>Cover Letter:</strong> {app.coverLetter}</p>

            <a
            href={app.resumeUrl} // ✅ Use `resumeUrl` directly, no need to prepend anything
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
            >
            📄 Download Resume
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
