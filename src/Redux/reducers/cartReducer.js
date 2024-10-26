const cartReducer = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        const product = state.find(item => item.productId === action.payload.productId);
        if (product) {
          return state.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        }
        return [...state, { ...action.payload }];
      case 'INCREASE_QUANTITY':
        return state.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      case 'DECREASE_QUANTITY':
        return state.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: Math.max(item.quantity - action.payload.quantity, 0) }
            : item
        ).filter(item => item.quantity > 0);
      case 'REMOVE_FROM_CART':
        return state.filter(item => item.productId !== action.payload.productId);
      default:
        return state;
    }
  };
  
  export default cartReducer;
  