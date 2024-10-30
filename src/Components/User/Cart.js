import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../Redux/actions/cartActions';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();

  const handleIncreaseQuantity = (itemId, variationId) => {
    dispatch(increaseQuantity(itemId, variationId));
  };

  const handleDecreaseQuantity = (itemId, variationId) => {
    dispatch(decreaseQuantity(itemId, variationId));
  };

  const handleRemoveItem = (itemId, variationId) => {
    dispatch(removeFromCart(itemId, variationId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Variation</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.productId + (item.variationId || '')}>
                <td className="py-2 px-4 border-b">
                  <img
                    src={item.image} // Assuming each item has an `image` property
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">
                  {item.variationDetails ? (
                    <div>
                      {item.variationDetails.size && <div>Size: {item.variationDetails.size}</div>}
                      {item.variationDetails.color && <div>Color: {item.variationDetails.color}</div>}
                      {item.variationDetails.material && <div>Material: {item.variationDetails.material}</div>}
                    </div>
                  ) : 'None'}
                </td>
                <td className="py-2 px-4 border-b">${item.price || item.generalPrice}</td>
                <td className="py-2 px-4 border-b flex items-center">
                  <button
                    onClick={() => handleDecreaseQuantity(item.productId, item.variationId)}
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    onClick={() => handleIncreaseQuantity(item.productId, item.variationId)}
                    className="px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 ml-2"
                  >
                    +
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  ${(item.price || item.generalPrice) * item.quantity}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.variationId)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
