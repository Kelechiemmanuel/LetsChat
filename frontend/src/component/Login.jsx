import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("https://letschat-xmph.onrender.com/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;

      if (!token) {
        console.log("No token returned from backend");
        return;
      }

      localStorage.setItem("token", token);

      console.log("TOKEN SAVED:", localStorage.getItem("token"));

      navigate("/chat");
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data);
  setError(err.response?.data?.error || "Something went wrong");

    }
  };

  return (
    <div className="bg-gray-400 h-screen flex justify-center items-center">
      <form onSubmit={handleLogin} className="bg-blue-500 flex flex-col gap-4 p-10">
        <h1>Login</h1>
        <p className="text-red-400">{error}</p>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <button type="submit" className="border rounded py-2">Login</button>
        <button onClick={() => navigate("/register")}>
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
};

export default Login;