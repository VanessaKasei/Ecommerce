import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Categories from "./Components/User/Categories";
import Home from "./Components/User/Home";


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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
