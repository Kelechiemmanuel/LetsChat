import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      await axios.post("https://letschat-lqqq.onrender.com/register", {
        email,
        password,
      });

      setSuccess("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-400 h-screen flex justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="bg-blue-500 flex flex-col gap-4 p-10"
      >
        <h1>Register</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

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
        <button type="submit" className="border rounded py-2">
          Register
        </button>
      </form>
           <button type="button" onClick={() => navigate("/login")}>
          Already have an account? Login
        </button>
    </div>
  );
};

export default Register;