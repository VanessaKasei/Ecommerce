
const initialState = {
  cartItems: [],//holds items added to the cart, initialized as an empty array
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const item = action.payload;
      
      // Check if item is already in the cart
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        // If the item exists, update the quantity
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      } else {
        // If the item is new, add it to the cart with an initial quantity of 1
        return {
          ...state,
          cartItems: [...state.cartItems, { ...item, quantity: 1 }],
        };
      }

    default:
      return state;
  }
};

export default cartReducer;