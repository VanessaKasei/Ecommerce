import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    console.log("you have submited your registration form");
  };

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <option>User</option>
          <option>Admin</option>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 p-2 text-center text-white"
          >
            Register
          </button>
        </div>
      </form>
      <p>Already have an account?<Link to={"/login"} className="text-blue-800 font-semibold">Login</Link></p>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
