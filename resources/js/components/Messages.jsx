import React, { useState, useEffect } from 'react';
import { Link, useParams, Routes, Route } from 'react-router-dom';
import axios from 'axios';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch conversations from Facebook API for Instagram
        const response = await axios.get('https://graph.facebook.com/v22.0/me/conversations', {
          params: {
            access_token: accessToken,
          },
        });
        setConversations(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch conversations: ' + (err.response?.data?.error?.message || err.message));
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Conversations</h2>
      <ul className="conversations-list list-none p-0">
        {conversations.map((conv) => (
          <li key={conv.id} className="conversation-item flex justify-between p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition duration-200">
            <div className="conv-details flex-1">
              <span className="conv-name font-bold text-gray-800 block">{conv.name}</span>
              <span className="conv-message text-sm text-gray-600">{conv.snippet}</span>
            </div>
            <span className="conv-time text-xs text-gray-500">{new Date(conv.updated_time).toLocaleString()}</span>
            <Link to={`/dashboard/messages/${conv.id}`} className="reply-btn px-4 py-2 bg-blue-600 text-white rounded-full ml-4 hover:bg-blue-500 transition duration-300">
              View & Reply
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Conversation = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch messages from Instagram API
        const response = await axios.get(`https://graph.instagram.com/${id}/messages`, {
          params: {
            access_token: accessToken,
          },
        });
        setMessages(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages: ' + (err.response?.data?.error?.message || err.message));
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No access token found. Please log in again.');
      return;
    }

    try {
      // Send a reply to the conversation using Instagram API
      await axios.post(`https://graph.instagram.com/${id}/messages`, {
        message: newMessage,
        access_token: accessToken,
      });
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'You', time: 'Now' }]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Conversation with {id}</h2>
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-item ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <p className="message-text">{msg.text}</p>
            <span className="message-time text-xs text-gray-500">{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="send-message mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input p-2 border rounded w-full"
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-btn px-4 py-2 bg-blue-600 text-white rounded-full mt-2 hover:bg-blue-500 transition duration-300">
          Send
        </button>
      </div>
    </div>
  );
};

const Messages = () => {
  return (
    <Routes>
      <Route path="/" element={<ConversationsList />} />
      <Route path=":id" element={<Conversation />} />
    </Routes>
  );
};

export default Messages;
