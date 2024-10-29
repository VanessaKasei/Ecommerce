import { combineReducers } from "redux";
import cartReducer from "./cartReducer";

const rootReducer = combineReducers({
    cart: cartReducer//used to assign the cart reducer to the cart key in the store
})

export default rootReducer;


//contains combineReducers to combine cartReducer and any other reducers