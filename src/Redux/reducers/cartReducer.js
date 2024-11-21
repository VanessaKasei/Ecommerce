const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartReducer = (state = initialState, action) => {
  let updatedCartItems;

  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, selectedVariationId, selectedVariation } = action.payload;
      const variation =
        (product.variations || []).find(
          (variationItem) => variationItem._id === selectedVariationId
        ) || null;

      const price = variation ? variation.price : product.generalPrice;
      const image = variation ? variation.image : product.image;

      const existingItem = state.cartItems.find(
        (item) =>
          item._id === product._id && item.variationId === selectedVariationId
      );

      if (existingItem) {
        // If item already in cart, increase quantity
        updatedCartItems = state.cartItems.map((item) =>
          item._id === product._id && item.variationId === selectedVariationId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item is new, add it to the cart
        updatedCartItems = [
          ...state.cartItems,
          {
            _id: product._id,
            name: product.name,
            price,
            image,
            variationId: selectedVariationId,
            variationDetails: selectedVariation,
            quantity: 1,
          },
        ];
        console.log("Updated cart items:", updatedCartItems);
      }
      break;
    }

    case "INCREASE_QUANTITY": {
      updatedCartItems = state.cartItems.map((item) =>
        item._id === action.payload.productId &&
        item.variationId === action.payload.selectedVariationId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;
    }

    case "DECREASE_QUANTITY": {
      updatedCartItems = state.cartItems.map((item) =>
        item._id === action.payload.productId &&
        item.variationId === action.payload.selectedVariationId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );
      break;
    }

    case "REMOVE_FROM_CART": {
      updatedCartItems = state.cartItems.filter(
        (item) =>
          !(
            item._id === action.payload.productId &&
            item.variationId === action.payload.selectedVariationId
          )
      );
      break;
    }
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [], 
      };

    default:
      return state;
  }

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  return {
    ...state,
    cartItems: updatedCartItems,
  };
};

export default cartReducer;
