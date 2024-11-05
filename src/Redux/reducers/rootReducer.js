import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import userReducer from "./usersReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  user : userReducer
});


export default rootReducer;
