import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ViewJobs() {
  const { id } = useParams(); // Event ID
  const { user } = useAuth(); // Get logged-in user
  const [jobs, setJobs] = useState(null); // ✅ Start as null to handle loading correctly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch(`http://localhost:3000/jobPostings/${id}/jobs`, {
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
        console.log("🔹 API Response:", data); // ✅ Debugging log
        if (data.jobPostings && Array.isArray(data.jobPostings)) {
          setJobs(data.jobPostings); // ✅ Set correctly
        } else {
          setJobs([]); // ✅ Ensure an empty array if no jobs exist
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch jobs:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  console.log("🔹 State: jobs =", jobs); // ✅ Log the state for debugging

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">⚠️ {error}</p>;
  if (!jobs || jobs.length === 0) return <p>No job postings yet.</p>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Job Postings</h2>

      <ul className="space-y-4">
        {jobs.map((job) => {
          // ✅ Check if job data exists
          console.log("✅ Rendering Job:", job);

          // 🔹 Determine the correct route based on user role
          let jobLink = `/jobPostings/${id}/jobs/${job.id}/apply`; // Default for volunteers/staff
          if (user?.role === "organizer") {
            jobLink = `/jobPostings/${id}/jobs/${job.id}/applications`; // Organizers see applications
          }

          return (
            <li key={job.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{job.title} ({job.role})</h3>
              <p className="text-gray-600">{job.description}</p>

              <Link to={jobLink} className="text-blue-500 underline">
                {user?.role === "organizer" ? "View Applications" : "Apply Now"}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
