import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const [cart, setCart] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const state = useSelector((state) => state);
  console.log(state);
  const userId = state.user?.id; // Use optional chaining to avoid accessing undefined
  const navigate = useNavigate();

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);

  // Handle input changes for shipping details
  const handleShippingChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleConfirmOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({
          userId,
          cartItems: cart.cartItems,
          shippingDetails,
          paymentMethod,
        }),
      });

      if (response.ok) {
        alert('Order confirmed successfully!');
        navigate('/order-summary'); // Redirect to order summary page
      } else {
        const errorData = await response.json();
        alert(`Order confirmation failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("An error occurred during order confirmation.");
    }
  };

  if (!cart) return <div>Loading cart...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Confirm Your Order</h2>
      <div>
        <h3 className="text-lg font-semibold">Cart Items:</h3>
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200 mb-4">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-4 border-b border-gray-200">Product</th>
              <th className="py-2 px-4 border-b border-gray-200">Variation</th>
              <th className="py-2 px-4 border-b border-gray-200">Price</th>
              <th className="py-2 px-4 border-b border-gray-200">Quantity</th>
              <th className="py-2 px-4 border-b border-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.cartItems.map((item) => (
              <tr key={item._id + (item.variationId || '')}>
                <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.variationDetails ? (
                    <div>
                      {item.variationDetails.size && <div>Size: {item.variationDetails.size}</div>}
                      {item.variationDetails.color && <div>Color: {item.variationDetails.color}</div>}
                    </div>
                  ) : 'None'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">ksh {item.price || item.generalPrice}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.quantity}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ksh {((item.price || item.generalPrice) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Shipping Details:</h3>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingDetails.address}
            onChange={handleShippingChange}
            className="block w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingDetails.city}
            onChange={handleShippingChange}
            className="block w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={shippingDetails.postalCode}
            onChange={handleShippingChange}
            className="block w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingDetails.country}
            onChange={handleShippingChange}
            className="block w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Payment Method:</h3>
          <label className="block mb-2">
            <input
              type="radio"
              name="paymentMethod"
              value="Mpesa"
              checked={paymentMethod === 'Mpesa'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Mpesa
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            PayPal
          </label>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
