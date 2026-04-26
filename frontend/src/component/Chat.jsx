import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const getMessages = async () => {
    try {
        const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3001/messages", {
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
  }, []);

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/messages",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent("");
      getMessages();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Chat</h1>

      {messages.map((msg) => (
        <div key={msg.id}>
          <b>{msg.sender}</b>
          <p>{msg.content}</p>
        </div>
      ))}

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;