import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Orders from "./Components/Admin/Orders";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Cart from "./Components/User/Cart";
import Categories from "./Components/User/Categories";
import ConfirmOrder from "./Components/User/ConfirmOrder";
import Home from "./Components/User/Home";
import NavBar from "./Components/User/Navbar";
import OrderDetails from "./Components/User/OrderDetails";
import ProductDetails from "./Components/User/ProductDetails";
function App() {
  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/categories" element= {<Categories />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/orderDetails" element={<OrderDetails />}></Route>
          <Route path="/confirmOrder/:userId" element={<ConfirmOrder />} />
          <Route path="/orders" element= {<Orders />}></Route>
          <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
