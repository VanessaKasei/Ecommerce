import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Cart from "./Components/User/Cart";
import Categories from "./Components/User/Categories";
import Home from "./Components/User/Home";
import OrderDetails from "./Components/User/OrderDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/categories" element= {<Categories />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/orderDetails" element={<OrderDetails />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
