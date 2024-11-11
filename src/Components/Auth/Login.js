import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserId } from "../../Redux/actions/userActions";
const Login = (userId) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      console.log("decoded token:", decodedToken);

      const { userId, role } = decodedToken;

      if (userId) {
        dispatch(setUserId(userId, role));
        console.log("User ID from token:", userId);

        await fetchUserCart(userId);
        if (role === "admin") {
          navigate("/modify");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  const fetchUserCart = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
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
    <div className="mx-auto container">
    <div className="w-3/4 flex flex-col justify-center">
      <div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Login
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm/6 font-medium text-gray-900">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 mt-3 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
