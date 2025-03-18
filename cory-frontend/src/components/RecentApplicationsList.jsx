import { useState, useEffect } from "react"; // ✅ Ensure hooks are imported

export default function RecentApplicationsList({ fetchURL }) {
    const [applications, setApplications] = useState([]);
  
    useEffect(() => {
      async function fetchApplications() {
        try {
          const response = await fetch(fetchURL, { credentials: "include" });
          const data = await response.json();
          setApplications(data.slice(0, 5)); // ✅ Show only the latest 5 applications
        } catch (err) {
          console.error("❌ Error fetching applications:", err);
        }
      }
  
      fetchApplications();
    }, [fetchURL]);
  
    return (
      <div className="dashboard-section">
        <h2>Recent Applications</h2>
        <ul>
          {applications.length > 0 ? (
            applications.map(app => (
              <li key={app.id}>
                <strong>{app.user.username}</strong> applied for <strong>{app.job.title}</strong>
              </li>
            ))
          ) : (
            <p>No recent applications.</p>
          )}
        </ul>
        <a href="/all-applications" className="view-all">View All Applications</a>
      </div>
    );
  }
  