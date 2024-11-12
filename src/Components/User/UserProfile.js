import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user session (token and role)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p className="mt-4">Welcome to your profile page!</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
