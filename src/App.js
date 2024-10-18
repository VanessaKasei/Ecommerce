import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Modify from "./Components/Admin/Modify";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Home from "./Components/User/Home";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/modify" element={<Modify />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
