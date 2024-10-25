export const addToCart = (product) => ({
  type: "ADD_TO_CART",
  payload: product,
});

export const increaseQuantity = (productId, quantity) => ({
  type: "INCREASE_QUNTITY",
  payload: { productId, quantity },
});

export const decreaseQuantity = (productId, quantity) => ({
  type: "DECREASE_QUANTITY",
  payload: { productId, quantity },
});

export const removeFromCart = (productId) =>({
    type: 'REMOVE_FROM_CART',
    payload: {productId}
})
