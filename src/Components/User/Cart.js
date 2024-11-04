import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../Redux/actions/cartActions';

const Cart = () => {
  const userId = useSelector((state) => state.user?.id); // Fetch the userId directly
  console.log("User ID:", userId); // Check if userId is properly set
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIncreaseQuantity = (productId, selectedVariationId) => {
    dispatch(increaseQuantity(productId, selectedVariationId));
  };

  const handleDecreaseQuantity = (productId, selectedVariationId) => {
    dispatch(decreaseQuantity(productId, selectedVariationId));
  };

  const handleRemoveItem = (productId, selectedVariationId) => {
    dispatch(removeFromCart(productId, selectedVariationId));
  };

  const handleCheckout = async () => {
    const checkoutData = {
      userId: userId,
      cartItems: cartItems,
    };

    try {
      const response = await fetch('/api/checkout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Checkout successful:', data);
        navigate('/orderDetails'); // Redirect to order confirmation page
      } else {
        // Handle errors from the server
        const errorData = await response.json();
        console.error('Checkout failed:', errorData);
      }
    } catch (error) {
      // Handle network errors
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="p-4 mx-auto container">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200">Image</th>
              <th className="py-3 px-4 border-b border-gray-200">Product</th>
              <th className="py-3 px-4 border-b border-gray-200">Variation</th>
              <th className="py-3 px-4 border-b border-gray-200">Price</th>
              <th className="py-3 px-4 border-b border-gray-200">Quantity</th>
              <th className="py-3 px-4 border-b border-gray-200">Total</th>
              <th className="py-3 px-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((product) => (
              <tr key={product._id + (product.variationId || '')}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">{product.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {product.variationDetails ? (
                    <div>
                      {product.variationDetails.size && <div>Size: {product.variationDetails.size}</div>}
                      {product.variationDetails.color && <div>Color: {product.variationDetails.color}</div>}
                      {product.variationDetails.material && <div>Material: {product.variationDetails.material}</div>}
                    </div>
                  ) : 'None'}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">ksh {product.price || product.generalPrice}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDecreaseQuantity(product._id, product.variationId)}
                      className="px-2 py-1 bg-gray-300 text-black rounded mr-2"
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(product._id, product.variationId)}
                      className="px-2 py-1 bg-gray-300 text-black rounded ml-2"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ksh {((product.price || product.generalPrice) * product.quantity).toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => handleRemoveItem(product._id, product.variationId)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleCheckout} // Attach the checkout handler
          className="bg-green-500 text-white p-2 mt-4 rounded hover:bg-green-600"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
