import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdate, setStatusUpdate] = useState({}); // To store status updates for orders

  const ordersPerPage = 3;

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`http://localhost:5000/api/orders`);
      const data = await response.json();
      if (data.orders) {
        console.log("Fetched orders:", data.orders);    
        setOrders(data.orders);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleStatusChange = (orderId, status) => {
    setStatusUpdate({ ...statusUpdate, [orderId]: status });

    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus: status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order status updated:", data);
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Group orders by their _id to display them in different divs
  const groupedOrders = paginatedOrders.reduce((acc, order) => {
    (acc[order._id] = acc[order._id] || []).push(order);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.keys(groupedOrders).map((orderId) => (
          <div key={orderId} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-teal-600">Order ID: {orderId}</h2>

            <div className="mt-4">
              {groupedOrders[orderId].map((order, index) => (
                <div key={index} className="mb-4">
                  {order.cartItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center border-b py-3">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-700">Quantity: {item.quantity}</p>
                      <p className="text-gray-700">Price: ${item.price}</p>
                    </div>
                  ))}
                </div>
              ))}

              <div className="mt-4 text-gray-700 space-y-2">
                <p><strong>User ID:</strong> {groupedOrders[orderId][0].userId}</p>
                <p><strong>Shipping Address:</strong> {groupedOrders[orderId][0].shippingInfo.address}</p>
                <p><strong>Payment Method:</strong> {groupedOrders[orderId][0].paymentMethod}</p>
                <p><strong>Payment Status:</strong> {groupedOrders[orderId][0].paymentStatus}</p>
                <p><strong>Order Date:</strong> {new Date(groupedOrders[orderId][0].createdAt).toLocaleString()}</p>
              </div>

              {/* Order Status */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-teal-600">Order Status</h3>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`status-${orderId}`}
                      checked={statusUpdate[orderId] === "pending" || groupedOrders[orderId][0].orderStatus === "pending"}
                      onChange={() => handleStatusChange(orderId, "pending")}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Pending</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`status-${orderId}`}
                      checked={statusUpdate[orderId] === "dispatched" || groupedOrders[orderId][0].orderStatus === "dispatched"}
                      onChange={() => handleStatusChange(orderId, "dispatched")}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Dispatched</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`status-${orderId}`}
                      checked={statusUpdate[orderId] === "delivered" || groupedOrders[orderId][0].orderStatus === "delivered"}
                      onChange={() => handleStatusChange(orderId, "delivered")}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Delivered</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              currentPage === index + 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;