import { useState, useEffect } from "react"; // ✅ Ensure hooks are imported

export default function UpcomingEventsList({ fetchURL }) {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      async function fetchEvents() {
        try {
          const response = await fetch(fetchURL, { credentials: "include" });
          const data = await response.json();
          setEvents(data);
        } catch (err) {
          console.error("❌ Error fetching events:", err);
        }
      }
  
      fetchEvents();
    }, [fetchURL]);
  
    return (
      <div className="dashboard-section">
        <h2>Upcoming Events</h2>
        <ul>
          {events.length > 0 ? (
            events.map(event => (
              <li key={event.id}>
                <strong>{event.title}</strong> - {event.date}
              </li>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </ul>
      </div>
    );
  }
  