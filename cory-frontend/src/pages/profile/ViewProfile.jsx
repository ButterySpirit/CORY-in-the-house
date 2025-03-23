import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User } from "lucide-react";

export default function ViewProfile() {
  const { user } = useAuth();
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setError("Failed to load profile."));
  }, [userId]);

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!profile) return <p className="text-center mt-6">Loading...</p>;

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
      {/* Profile Picture or Icon */}
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="text-gray-400 w-16 h-16" />
        )}
      </div>

      <h2 className="text-2xl font-bold">{profile.username}</h2>
      <p className="text-gray-600">{profile.email}</p>

      {/* Action Button */}
      <div className="mt-6">
        {isOwnProfile ? (
          <Link to={`/profile/${user.id}/edit`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Edit Profile
            </button>
          </Link>
        ) : (
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
            Message this user
          </button>
        )}
      </div>
    </div>
  );
}
