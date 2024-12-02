import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ConfirmOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = useSelector((state) => state.user.userId);
  console.log("Fetched userId:", userId);

  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        console.log("Fetched order data:", data);
        setOrders(data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [userId]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (orders.length === 0) {
    return <p>No orders for this user.</p>;
  }

  const ordersPerPage = 2;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        My Orders
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {currentOrders.map((order) => (
          <div
            key={order.userId}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-6 bg-teal-600 text-white">
              <span className="whitespace-nowrap">
                <h3 className="text-2xl font-semibold">
                  Order ID: {order._id}
                </h3>
              </span>
              <p className="mt-2 text-sm">
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-2 text-lg">{order.orderStatus}</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Payment Method
                </h4>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Payment Status
                </h4>
                <p className="text-gray-600">{order.paymentStatus}</p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                Shipping Info
              </h4>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Address:</strong> {order.shippingInfo.address}
                </p>
                <p className="text-gray-600">
                  <strong>City:</strong> {order.shippingInfo.city}
                </p>
                <p className="text-gray-600">
                  <strong>Postal Code:</strong> {order.shippingInfo.postalCode}
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                Items in your order:
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                        Variation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-200"
                      >
                        <td className="px-4 py-2 text-gray-800 font-semibold">
                          {product.name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          ${product.price}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {product.variationDetails
                            ? `${product.variationDetails.size || "N/A"} | ${
                                product.variationDetails.color || "N/A"
                              } | ${product.variationDetails.material || "N/A"}`
                            : "None"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleBackToHome}
          className="px-6 py-3 bg-teal-600 text-white font-semibold text-lg rounded-full hover:bg-teal-700 transition duration-300"
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
