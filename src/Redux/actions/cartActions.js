export const addToCart = (product, selectedVariationId, selectedVariation) => {
  return {
    type: 'ADD_TO_CART',
    payload: { product, selectedVariationId, selectedVariation },
  };
};


export const increaseQuantity = (productId, variationId) => ({
  type: 'INCREASE_QUANTITY',
  payload: { productId, variationId },
});

export const decreaseQuantity = (productId, variationId) => ({
  type: 'DECREASE_QUANTITY',
  payload: { productId, variationId },
});

export const removeFromCart = (productId, variationId) => ({
  type: 'REMOVE_FROM_CART',
  payload: { productId, variationId },
});
