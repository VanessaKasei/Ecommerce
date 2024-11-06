import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const OrderDetails = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [paymentStatus, setPaymentStatus] = useState("payLater");
  const userId = useSelector((state) => state.user.userId);
  console.log("user id is:", userId);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const cartData = await response.json();
        setCartItems(cartData.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const orderData = {
      userId,
      cartItems,
      shippingInfo,
      paymentMethod,
      paymentStatus,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      console.log("Order placed successfully:", data);
      toast.success("Order placed successfylly!");
      navigate(`/confirmOrder/${data.orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again later");
    }
  };

  return (
    <div className="p-4 mx-auto container">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200">Image</th>
              <th className="py-3 px-4 border-b border-gray-200">Product</th>
              <th className="py-3 px-4 border-b border-gray-200">Price</th>
              <th className="py-3 px-4 border-b border-gray-200">Variations</th>
              <th className="py-3 px-4 border-b border-gray-200">Quantity</th>
              <th className="py-3 px-4 border-b border-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((product) => (
              <tr key={product._id + (product.variationId || "")}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ksh {product.price || product.generalPrice}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {product.variationDetails ? (
                    <div>
                      <p>Size: {product.variationDetails.size}</p>
                      <p>Color: {product.variationDetails.color}</p>
                      <p>Material: {product.variationDetails.material}</p>
                    </div>
                  ) : (
                    <p>None</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {product.quantity}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ksh{" "}
                  {(
                    (product.price || product.generalPrice) * product.quantity
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
      <tr>
        <td colSpan="5" className="py-2 px-4 text-right font-semibold">
          Total Amount:
        </td>
        <td className="py-2 px-4 font-semibold">
          ksh{" "}
          {cartItems
            .reduce((total, product) => {
              return (
                total + (product.price || product.generalPrice) * product.quantity
              );
            }, 0)
            .toFixed(2)}
        </td>
      </tr>
    </tfoot>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your shipping address"
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your city"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your postal code"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="mpesa">MPesa</option>
            </select>
          </div>
          {paymentMethod === "mpesa" && (
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Payment Status
              </label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="payNow"
                    checked={paymentStatus === "payNow"}
                    onChange={handlePaymentStatusChange}
                  />
                  Pay Now
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="payLater"
                    checked={paymentStatus === "payLater"}
                    onChange={handlePaymentStatusChange}
                  />
                  Pay After Delivery
                </label>
              </div>
            </div>
          )}
        </form>
        <div className="mt-6">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700"
          >
            Place Order
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
