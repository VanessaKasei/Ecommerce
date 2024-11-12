import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../Redux/actions/cartActions";

const Cart = () => {
  const userId = useSelector((state) => state.user.userId);
  console.log("user id is:", userId);

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

  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const openModal = (product) => {
    setItemToRemove(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToRemove(null);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      handleRemoveItem(itemToRemove._id, itemToRemove.variationId);
      closeModal();
    }
  };

  const handleCheckout = async () => {
    const checkoutData = {
      userId: userId,
      cartItems: cartItems.map((item) => ({
        ...item,
        variationDetails: item.variationDetails || {}, 
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!userId) {
        navigate("/login");
        toast.error("Log in first then checkout");
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Checkout successful:", data);

        navigate("/orderDetails");
      } else {
        const errorData = await response.json();
        console.error("Checkout failed:", errorData);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="p-4 mx-auto container">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Image
              </th>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Product
              </th>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Variations
              </th>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Price
              </th>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Quantity
              </th>
              <th className="py-3 px-4 border-b border-gray-200 border-r text-start">
                Total
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((product) => (
              <tr key={product._id + (product.variationId || "")}>
                <td className="py-2 px-4 border-b border-gray-200 border-r">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200 border-r whitespace-nowrap">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 border-r">
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
                <td className="py-2 px-4 border-b border-gray-200 border-r">
                  <span className="whitespace-nowrap">ksh {product.price || product.generalPrice}</span>
                </td>
               
                <td className="py-2 px-4 border-b border-gray-200 border-r">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleDecreaseQuantity(product._id, product.variationId)
                      }
                      className="px-2 py-1 bg-gray-300 text-black rounded mr-2"
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleIncreaseQuantity(product._id, product.variationId)
                      }
                      className="px-2 py-1 bg-gray-300 text-black rounded ml-2"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 border-r">
                  <span className="whitespace-nowrap"> ksh{" "}
                  {((product.price || product.generalPrice) * product.quantity).toFixed(2)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => openModal(product)}
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
          onClick={handleCheckout}
          className="bg-green-500 text-white p-2 mt-4 rounded hover:bg-green-600"
        >
          Proceed to checkout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p>Are you sure you want to remove this item from the cart?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveItem}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;