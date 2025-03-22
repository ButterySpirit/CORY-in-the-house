import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ViewJobs() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/jobPostings/${eventId}/jobs`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Job API Response:", data);
        const jobArray = Array.isArray(data)
          ? data
          : Array.isArray(data.jobPostings)
          ? data.jobPostings
          : [];

        if (jobArray.length) {
          setJobs(jobArray);
        } else {
          setError("Unexpected data format received from server.");
        }
      })
      .catch(() => setError("Failed to fetch job postings"));
  }, [eventId]);

  const handleDelete = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/jobPostings/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setSuccessMsg("Job deleted.");
    } catch (err) {
      setError("Error deleting job.");
    }
  };

  const handleApply = async (jobId, role) => {
    const formData = new FormData();

    if (role === "staff") {
      const fileInput = document.getElementById(`resume-${jobId}`);
      if (!fileInput.files.length) {
        setError("Staff must upload a resume to apply.");
        return;
      }
      formData.append("resume", fileInput.files[0]);
    }

    try {
      const res = await fetch(`http://localhost:3000/jobApplications/${jobId}/apply`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply.");

      setSuccessMsg("Application submitted!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Job Openings</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}

      {jobs.length === 0 ? (
        <p>No job postings found.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 bg-white shadow flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-700">{job.description}</p>
              <p className="text-sm font-medium text-gray-600">Role: {job.role}</p>

              {user?.role === "organizer" && (
                <div className="flex gap-3 mt-2">
                  <Link
                    to={`/jobPostings/${job.id}/edit`}
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}

              {(user?.role === "staff" || user?.role === "volunteer") && (
                <div className="mt-3">
                  {job.role === "staff" && (
                    <input
                      id={`resume-${job.id}`}
                      type="file"
                      accept=".pdf"
                      className="mb-2"
                    />
                  )}
                  <button
                    onClick={() => handleApply(job.id, job.role)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
