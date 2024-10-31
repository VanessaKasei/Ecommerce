const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};


const cartReducer = (state = initialState, action) => {
  let updatedCartItems;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, selectedVariationId } = action.payload;
      const variation = product.variations?.find(variationItem => variationItem._id === selectedVariationId) || null;
      const price = variation ? variation.price : product.generalPrice;
      const image = variation ? variation.image : product.image;

      const existingItem = state.cartItems.find(
        item => item._id === product._id && item.variationId === selectedVariationId
      );

      if (existingItem) {
        updatedCartItems = state.cartItems.map(item =>
          item._id === product._id && item.variationId === selectedVariationId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCartItems = [
          ...state.cartItems,
          {
            _id: product._id,
            name: product.name,
            price,
            image,
            variationId: selectedVariationId,
            quantity: 1,
          },
        ];
      }
      break;
    }

    case 'INCREASE_QUANTITY': {
      updatedCartItems = state.cartItems.map(item =>
        item._id === action.payload.productId && item.variationId === action.payload.selectedVariationId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      break;
    }

    case 'DECREASE_QUANTITY': {
      updatedCartItems = state.cartItems.map(item =>
        item._id === action.payload.productId && item.variationId === action.payload.selectedVariationId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );
      break;
    }

    case 'REMOVE_FROM_CART': {
      updatedCartItems = state.cartItems.filter(
        item => !(item._id === action.payload.productId && item.variationId === action.payload.selectedVariationId)
      );
      break;
    }

    default:
      return state;
  }

  // Update localStorage with the latest cart state after each action
  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

  // Return the new state
  return {
    ...state,
    cartItems: updatedCartItems,
  };
};

export default cartReducer;
