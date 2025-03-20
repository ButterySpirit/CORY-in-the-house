import { useState, useEffect } from "react";
import EventList from "../../components/EventList";

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/events", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${await res.text()}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading events...</p>;
  if (error) return <p className="text-center text-red-500">⚠️ {error}</p>;

  return <EventList events={events} title="Event Calendar" />;
}
