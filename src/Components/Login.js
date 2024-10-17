import React, { useState } from "react";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");


  const handleSubmit = (e) =>{
    e.preventDefault()

    console.log("logged in with",{email, password});
    

  }

  return (
    <div>
      <div>
        <h2 className="text-center font-semibold">Login</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
            <label>Password:</label>
            <input type="password"
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}/>

        </div>
        <div>
            <label>Email:</label>
            <input type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
            <button type="submit"
            className="bg-blue-500 text-white p-2">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
