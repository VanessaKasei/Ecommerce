import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const ConfirmOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  console.log("Fetched orderId:", orderId);


  const navigate = useNavigate(); // Hook to navigate

  const handleBackToHome = () => {
    navigate("/"); // Navigates to the homepage
  };


  useEffect(() => {
    if (!orderId) {
      console.error("Order ID is missing");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Order Confirmation
      </h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">Field</th>
            <th className="border-b px-4 py-2 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Order ID</td>
            <td className="border-b px-4 py-2">{order.orderId}</td>
          </tr>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Order Status</td>
            <td className="border-b px-4 py-2">{order.orderStatus}</td>
          </tr>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Payment Method</td>
            <td className="border-b px-4 py-2">{order.paymentMethod}</td>
          </tr>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Payment Status</td>
            <td className="border-b px-4 py-2">{order.paymentStatus}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-xl font-semibold mt-6 mb-4">Shipping Info:</h3>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <tbody>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Address</td>
            <td className="border-b px-4 py-2">{order.shippingInfo.address}</td>
          </tr>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">City</td>
            <td className="border-b px-4 py-2">{order.shippingInfo.city}</td>
          </tr>
          <tr>
            <td className="border-b px-4 py-2 font-semibold">Postal Code</td>
            <td className="border-b px-4 py-2">
              {order.shippingInfo.postalCode}
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-xl font-semibold mt-6 mb-4">Items in your order:</h3>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">Product Name</th>
            <th className="border-b px-4 py-2 text-left">Quantity</th>
            <th className="border-b px-4 py-2 text-left">Price</th>
            {/* <th className="border-b px-4 py-2 text-left">Variation</th> */}
          </tr>
        </thead>
        <tbody>
          {order.cartItems.map((product) => (
            <tr key={product._id}>
              <td className="border-b px-4 py-2">{product.name}</td>
              <td className="border-b px-4 py-2">{product.quantity}</td>
              <td className="border-b px-4 py-2">{product.price}</td>
              <td className="py-2 px-4 border-b border-gray-200"></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleBackToHome}
        className="px-4 py-2 mt-4 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700"
      >
        Back to Home Page
      </button>
    </div>
  );
};

export default ConfirmOrder;
