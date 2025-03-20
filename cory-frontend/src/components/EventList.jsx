import { Link } from "react-router-dom";

export default function EventList({ events, title }) {
  if (!events || events.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No events available.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-5 bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 line-clamp-2">{event.description}</p>
            <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
              <span>📍 {event.location}</span>
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full">
                🏆 {event.jobPostingsCount ?? 0} Job Openings
              </span>
            </div>
            <Link
              to={`/events/${event.id}`}
              className="block mt-4 bg-black text-white text-center py-2 rounded hover:bg-gray-800 transition"
            >
              View Event
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
