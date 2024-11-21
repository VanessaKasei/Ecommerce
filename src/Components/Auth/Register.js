import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError(true);
      setMessage("All fields are required");
      return;
    }

    const userData = {
      email,
      password,
      role,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful");
        setError(false);
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        setMessage(data.message || "Something went wrong");
        setError(true);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setMessage("Error submitting the form");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100">
      <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg mt-12">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                Admin
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to={"/login"} className="text-teal-600 font-semibold">
            Login
          </Link>
        </p>
        {message && (
          <p
            className={`mt-4 text-sm ${
              error ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
