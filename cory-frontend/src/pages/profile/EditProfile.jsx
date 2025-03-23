import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, refreshUser } = useAuth(); // ✅ Pull in refreshUser
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("username", username);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");

      await refreshUser(); // ✅ Refresh user in context
      setSuccess("Profile updated!");
      setTimeout(() => navigate(`/profile/${user.id}`), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile Preview"
            className="w-28 h-28 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <input
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
