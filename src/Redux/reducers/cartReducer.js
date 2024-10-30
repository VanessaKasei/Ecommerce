const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { product, selectedVariationId } = action.payload;

      // Ensure product and variations array are defined
      if (!product) return state;
      const variations = product.variations || [];

      // Check if the product has variations and select the appropriate variation
      const variation = variations.length > 0
        ? selectedVariationId
          ? variations.find((varItem) => varItem._id === selectedVariationId)
          : variations[0]
        : null;

      const price = variation ? variation.price : product.generalPrice;
      const image = variation ? variation.image : product.image;

      // Check for an existing item in the cart
      const existingItem = state.cartItems.find(
        (cartItem) =>
          cartItem._id === product._id &&
          cartItem.variationId === (variation ? variation._id : null)
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === product._id &&
            cartItem.variationId === (variation ? variation._id : null)
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [
            ...state.cartItems,
            {
              _id: product._id,
              name: product.name,
              price,
              image,
              variationId: variation ? variation._id : null,
              variationDetails: variation || null,
              quantity: 1,
            },
          ],
        };
      }


      case 'INCREASE_QUANTITY': {
        const { productId, variationId } = action.payload;
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === productId && item.variationId === variationId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
  
      case 'DECREASE_QUANTITY': {
        const { productId, variationId } = action.payload;
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === productId && item.variationId === variationId
              ? {
                  ...item,
                  quantity: item.quantity > 1 ? item.quantity - 1 : 1, // Prevent quantity from going below 1
                }
              : item
          ),
        };
      }
  
      case 'REMOVE_FROM_CART': {
        const { productId, variationId } = action.payload;
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variationId === variationId)
          ),
        };
      }

    default:
      return state;
  }
};

export default cartReducer;
