import React from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

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
          <Link to="/profile">
            <FaUserCircle className="text-2xl hover:text-gray-300" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
