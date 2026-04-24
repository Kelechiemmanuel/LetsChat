import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  // const[sender, setSender] = useState('Joshua');
  const [content, setContent] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/messages', {
        headers: { Authorization: token }
      });
      setMessages(response.data)
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchData();
  }, []);

  const sendMessages = async () => {
    if (!content) return;
    try {
      const token = localStorage.getItem("token")
      await axios.post('http://localhost:3001/messages',
        { content },
        { headers: { Authorization: token } }
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
    fetchData();
    setContent('');
  }
  return (
    <div>
      <h1>CHAT</h1>
      {messages.map((msg) => (
        <div key={msg.id}>
          <h1>{msg.sender}</h1>
          <p>{msg.content}</p>
        </div>
      ))}

      <div>
        {/* <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} /> */}
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder='Write' />
        <button onClick={sendMessages}>Send</button>
      </div>
    </div>
  )
}

export default App