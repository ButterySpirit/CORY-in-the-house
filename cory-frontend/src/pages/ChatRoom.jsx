import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

// ✅ Initialize socket
const socket = io("http://localhost:3000", { withCredentials: true });

export default function ChatRoom() {
  const { user } = useAuth();
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // ✅ Parse roomId: "direct__userId1__userId2"
  const parseRoomParticipants = (roomId) => {
    const parts = roomId.split("__");
    if (parts.length !== 3) return null;

    const userId1 = parts[1];
    const userId2 = parts[2];

    return [userId1, userId2];
  };

  useEffect(() => {
    console.log("🧠 useEffect triggered with:");
    console.log("👉 roomId:", roomId);
    console.log("👉 user:", user);

    if (!user || !roomId) return;

    const participants = parseRoomParticipants(roomId);
    console.log("✅ Parsed participants:", participants);

    if (!participants || !participants.includes(user.id)) {
      console.warn("🚫 User is NOT authorized for this room");
      setIsAuthorized(false);
      return;
    }

    console.log("✅ User is authorized for this chat room");
    setIsAuthorized(true);

    // ✅ Join room
    socket.emit("joinRoom", roomId);

    // ✅ Fetch previous messages
    fetch(`http://localhost:3000/messages/${roomId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          } else {
            console.error("❌ Unexpected response format:", data);
            setMessages([]); // fallback to avoid .map crash
          }
        })
        .catch((err) => {
          console.error("❌ Failed to fetch messages:", err);
          setMessages([]); // fallback
        });
      

    // ✅ Listen for new messages
    socket.on("receiveMessage", ({ message, sender }) => {
      console.log("📩 Message received:", { sender, message });
      setMessages((prev) => [...prev, { message, sender }]);
    });

    // ✅ Cleanup on unmount
    return () => {
      console.log("👋 Cleaning up socket listener");
      socket.off("receiveMessage");
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (message.trim()) {
      console.log("📤 Sending message:", message);
      socket.emit("sendMessage", {
        roomId,
        message,
        sender: user.username,
        senderId: user.id,
      });
      setMessage("");
    }
  };

  if (!isAuthorized) {
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">
        ⚠️ You do not have permission to view this chat.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">💬 Chat</h2>

      <div className="border p-2 h-64 overflow-y-scroll mb-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-l px-3 py-2 w-full"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
