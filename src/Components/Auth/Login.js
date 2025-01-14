import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { setUserId } from "../../Redux/actions/userActions";



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData.message);
        alert(errorData.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      const decodedToken = jwtDecode(data.token);
      console.log("decoded token:", decodedToken);

      const { userId, role } = decodedToken;

      if (userId) {
        dispatch(setUserId(userId, role));
        console.log("User ID from token:", userId);

        await fetchUserCart(userId);
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  const fetchUserCart = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }

      const cartData = await response.json();
      setCartItems(cartData.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("An error occurred while fetching the cart data.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center  bg-gray-100 ">
      <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg mt-12">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">
            Login
          </h2>
        </div>
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
          <div className="mb-6">
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
          <div>
            <button
              type="submit"
              className=" bg-teal-600 text-white py-2 px-4 rounded-md text-sm font-semibold shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
