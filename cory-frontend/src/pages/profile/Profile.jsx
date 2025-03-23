import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPic, setNewPic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, []);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setNewPic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("profilePic", newPic);

    const res = await fetch("http://localhost:3000/users/me/profile-pic", {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Profile picture updated!");
      setProfile((prev) => ({ ...prev, profilePic: data.profilePic }));
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="mb-4">
        <img
          src={
            previewUrl ||
            `http://localhost:3000/uploads/profilePics/${profile.profilePic}`
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
      </div>

      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      <div className="mt-4">
        <input type="file" accept="image/*" onChange={handlePicChange} />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpload}
        >
          Upload
        </button>
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
}
