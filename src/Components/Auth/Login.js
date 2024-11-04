import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const fetchUserCart = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const cartData = await response.json();
      setCartItems(cartData.cartItems); // Store the cart items in state
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("An error occurred while fetching the cart data.");
    }
  };

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
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
  
      const decodedToken = jwtDecode(data.token);
      console.log(decodedToken); // Log the decoded token to check its structure
  
      const { userId, role } = decodedToken;
  
      // Dispatch user ID to Redux store
      dispatch({ type: 'SET_USER_ID', payload: userId });
  
      // Fetch the user's cart after successful login
      await fetchUserCart(userId);
  
      // Redirect based on user role
      if (role === "admin") {
        navigate("/modify");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
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
