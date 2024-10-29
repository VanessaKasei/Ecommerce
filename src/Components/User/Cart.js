import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="border-b pb-2 mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Price: ksh {item.generalPrice}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ksh {item.gereralPrice * item.quantity}</p>
            </div>
          ))}
          <div className="mt-4 font-bold">
            Total Amount: ksh{" "}
            {cartItems.reduce((acc, item) => acc + item.generalPrice * item.quantity, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
