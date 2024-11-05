import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const OrderDetails = () => {
  const [cartItems, setCartItems] = useState([]); 
  const userId = useSelector((state) => state.user.userId); 
  console.log("user id is:", userId);



  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const cartData = await response.json();
        setCartItems(cartData.cartItems || []); 
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

 

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
              <th className="py-3 px-4 border-b border-gray-200">Quantity</th>
              <th className="py-3 px-4 border-b border-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id + (item.variationId || '')}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">ksh {item.price || item.generalPrice}</td>
                <td className="py-2 px-4 border-b border-gray-200">{item.quantity}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ksh {((item.price || item.generalPrice) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
