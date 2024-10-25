// store.js

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cartReducer'; // Import your cart reducer

// Configure the store using Redux Toolkit
const store = configureStore({
  reducer: {
    cart: cartReducer, // Add your cart reducer here
  },
});

export default store;
