import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("https://letschat-lqqq.onrender.com/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data?.token) {
        setError("Login failed: no token returned");
        return;
      }

      localStorage.setItem("token", res.data.token);

      console.log("TOKEN SAVED");


      navigate("/chat");
    } catch (err) {
      setError("Invalid email or password");
      console.log(err.response?.data || err.message);
      console.log("User not found");

    }
  };

  return (
    <div className="bg-gray-400 h-screen flex justify-center items-center">
      <form onSubmit={handleLogin} className="bg-blue-500 flex flex-col gap-4 p-10">
        <h1>Login</h1>
        <p className="text-red-400">{error}</p>

        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-6 py-2 outline-0"
          />
        </div>

        <div className="flex justify-between items-center border rounded px-3 py-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} className="outline-0"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white text-sm outline-0"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit" className="border rounded py-2">Login</button>
        <button type="button" onClick={() => navigate("/register")}>
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
};

export default Login;