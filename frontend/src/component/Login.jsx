import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async() => {
        try {
            const response = await axios.post("http://localhost:3001/login", {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            console.log("Login successfully");
            window.location.href = '/';
        } catch (error) {
            console.log(error.response?.data || error.message);
            
        }
    }
  return (
    <div>
        <h1>LOGIN</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login