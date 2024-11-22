import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
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
import UserProfile from "./Components/User/UserProfile";

function Layout() {
  const location = useLocation();
  
  const shouldShowNavBar = !['/login', '/register'].includes(location.pathname);
  
  return (
    <>
      {shouldShowNavBar && <NavBar />}
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
          <Route path="/confirmOrder/:userId" element={<ConfirmOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
