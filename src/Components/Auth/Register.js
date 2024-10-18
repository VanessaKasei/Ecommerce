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
      console.log('Server Response:', data);  
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
      console.error('Error submitting the form:', error); // Log the error
      setMessage("Error submitting the form");
    }
    
  };

  return (
    <div className="mx-auto container">
      <div>
        <h2 className="text-center font-semibold text-lg">Register</h2>
        <div className="flex justify-start mt-12 border border-solid p-4">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div>
                <label>
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
              </div>
              <div>
                <label>
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
                className="bg-blue-500 p-2 text-center text-white"
              >
                Register
              </button>
            </div>
          </form>
        </div>
        <p>
          Already have an account?
          <Link to={"/login"} className="text-blue-800 font-semibold">
            Login
          </Link>
        </p>

        {message && (
          <p className={error ? "text=red-500" : "text-green=500"}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Register;
