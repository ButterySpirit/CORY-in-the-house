import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    console.log("📬 Inbox Loaded - Current User:", user);

    const fetchInbox = async () => {
      try {
        const response = await fetch("http://localhost:3000/messages/inbox", {
          method: "GET",
          credentials: "include",
        });

        console.log("📨 Raw Response Object:", response);

        if (!response.ok) throw new Error("Failed to load inbox");

        const data = await response.json();
        console.log("📨 Parsed Inbox Data:", data);

        setConversations(data);
      } catch (err) {
        console.error("❌ Inbox fetch error:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [user]);

  if (!user) return <p className="text-center mt-10 text-red-500">Please log in to view messages.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-500">Loading inbox...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-600">No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((chat) => (
            <li
              key={chat.roomId}
              className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/chat/${chat.roomId}`)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{chat.participant?.username || "Unknown"}</p>
                <span className="text-sm text-gray-500">
                  {chat.lastUpdated ? new Date(chat.lastUpdated).toLocaleString() : "No Date"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
