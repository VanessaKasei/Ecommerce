import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdate, setStatusUpdate] = useState({}); // To store status updates for orders

  const ordersPerPage = 5;

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
        // Handle success (perhaps notify the admin that the status was updated)
        console.log("Order status updated:", data);
      })
      .catch((error) => {
        // Handle error (display a message to the admin)
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {Object.keys(groupedOrders).map((orderId) => (
        <div key={orderId} className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold">Order ID: {orderId}</h2>
          <div>
            {groupedOrders[orderId].map((order, index) => (
              <div key={index} className="mt-4">
                {order.cartItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between border-b py-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                    <p className="text-gray-700">Price: ${item.price}</p>
                  </div>
                ))}
              </div>
            ))}

            <p className="text-gray-700">User ID: {groupedOrders[orderId][0].userId}</p>
            <p className="text-gray-700">Shipping Address: {groupedOrders[orderId][0].shippingInfo.address}</p>
            <p className="text-gray-700">Payment Method: {groupedOrders[orderId][0].paymentMethod}</p>
            <p className="text-gray-700">Payment Status: {groupedOrders[orderId][0].paymentStatus}</p>
            <p className="text-gray-700">Created At: {new Date(groupedOrders[orderId][0].createdAt).toLocaleString()}</p>

            <div className="mt-4">
              <h3 className="font-semibold">Order Status</h3>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name={`status-${orderId}`}
                    checked={statusUpdate[orderId] === "pending" || groupedOrders[orderId][0].orderStatus === "pending"}
                    onChange={() => handleStatusChange(orderId, "pending")}
                  />
                  Pending
                </label>
                <label>
                  <input
                    type="radio"
                    name={`status-${orderId}`}
                    checked={statusUpdate[orderId] === "dispatched" || groupedOrders[orderId][0].orderStatus === "dispatched"}
                    onChange={() => handleStatusChange(orderId, "dispatched")}
                  />
                  Dispatched
                </label>
                <label>
                  <input
                    type="radio"
                    name={`status-${orderId}`}
                    checked={statusUpdate[orderId] === "delivered" || groupedOrders[orderId][0].orderStatus === "delivered"}
                    onChange={() => handleStatusChange(orderId, "delivered")}
                  />
                  Delivered
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-center space-x-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={`px-4 py-2 rounded-md border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
