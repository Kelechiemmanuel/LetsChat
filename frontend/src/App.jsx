import Login from "./component/Login";
import Chat from "./component/Chat";
import Register from "./component/Register";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
      {/* root redirect logic */}
      <Route path="/" element={token ? <Navigate to="/chat" /> : <Navigate to="/login" /> }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/chat"
        element={token ? <Chat /> : <Navigate to="/login" />}
      />
    </Routes>
    </BrowserRouter>
  );
};

export default App;