import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const getMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      const res = await axios.get("https://letschat-lqqq.onrender.com/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      console.log("No token");
      return;
    }
    getMessages();

    const interval = setInterval(() => {
      getMessages();

      return () => clearInterval(interval);
    }, 30000);
  }, []);

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://letschat-lqqq.onrender.com/messages",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent("");
      getMessages();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-400 flex justify-center items-center h-screen">
    <div className="flex flex-col justify-center items-center gap-5 w-100 bg-white mx-auto h-auto py-5 px-3 rounded-sm">
      <div className="flex justify-between items-center bg-gray-600 w-full px-3 py-2 rounded-sm">
        <h1>Let's Chat</h1>
        <button onClick={handleLogout} className="cursor-pointer">Logout</button>
      </div>
      <div className="">
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender}</b>
            <p className="">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message..." className="outline-0"
        />

        <button onClick={sendMessage} className="cursor-pointer">Send</button>
      </div>
    </div>
    </div>
  );
};

export default Chat;