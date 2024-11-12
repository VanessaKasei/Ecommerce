import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [role, setRole] = useState(null);  // Track the role in state
  const navigate = useNavigate();

  // useEffect(() => {
  //   const savedRole = localStorage.getItem("role");
  //   setRole(savedRole); // Update the state with the role

  //   // Log the role to see which navbar is being displayed
  //   console.log("Current role:", savedRole);
  // }, []);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const isAdmin = role === "admin"; // Check if the user is an admin

  useEffect(() => {
    if (isAdmin) {
      console.log("Admin Navbar is being displayed.");
    } else {
      console.log("Regular User Navbar is being displayed.");
    }
  }, [role, isAdmin]); // Log whenever the role or isAdmin changes

  return (
    <nav className="bg-teal-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MyShop
        </Link>
        <div className="flex items-center space-x-4">
  
            <>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
              <button onClick={handleCartClick} className="relative">
                <FaShoppingCart className="text-2xl hover:text-gray-300" />
              </button>
            </>

          {/* User Profile Icon */}
          <Link to="/profile">
            <FaUserCircle className="text-2xl hover:text-gray-300" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
