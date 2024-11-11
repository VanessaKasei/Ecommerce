import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          `http://localhost:5000/api/orders/${userId}`
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        My Orders
      </h2>  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.userId}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-6 bg-teal-600 text-white">
              <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
              <p className="mt-2 text-lg">{order.orderStatus}</p>
            </div>
  
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Payment Method</h4>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>
  
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Payment Status</h4>
                <p className="text-gray-600">{order.paymentStatus}</p>
              </div>
  
              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Shipping Info</h4>
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
  
              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Items in your order:</h4>
              <div className="space-y-6">
                {order.cartItems.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <p className="text-gray-800 font-semibold">{product.name}</p>
                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <p className="text-gray-600">
                      <strong>Variation:</strong>{" "}
                      {product.variationDetails
                        ? `${product.variationDetails.size || "N/A"} | ${
                            product.variationDetails.color || "N/A"
                          } | ${product.variationDetails.material || "N/A"}`
                        : "No variations"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
