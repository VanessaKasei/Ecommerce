import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Server Response:', response);


      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      const data = await response.json(); 

      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);
      const role = decodedToken.role;

      if (role === "admin") {
        navigate("/modify");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occured while logging in.");
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-center font-semibold">Login</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
