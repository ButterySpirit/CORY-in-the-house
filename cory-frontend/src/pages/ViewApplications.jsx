import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ViewApplications() {
  const { jobId } = useParams();
  const { user } = useAuth();

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
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications.");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [jobId, user]);

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await fetch(`http://localhost:3000/applications/${applicationId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;
  if (!applications.length) return <p>No applications yet.</p>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>

      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.id} className="border p-4 rounded-lg shadow space-y-2">
            <h3 className="text-lg font-semibold">
              Applicant:{" "}
              <Link
                to={`/profile/${app.user?.id}`}
                className="text-blue-600 underline"
              >
                {app.user?.username || "Unknown"}
              </Link>
            </h3>
            <p className="text-gray-600">
              <strong>Email:</strong> {app.user?.email || "Not provided"}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {app.status}
            </p>

            {app.resumeUrl && (
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline block"
              >
                📄 Download Resume
              </a>
            )}

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => updateStatus(app.id, "accepted")}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(app.id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
