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
        // Fetch conversations from Laravel API
        const response = await axios.get('/api/user/conversations', {
          params: {
            access_token: accessToken,
          },
        });
        // console.log('data' , response.data.conversations.data )
        setConversations(response.data.conversations.data);
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
        {conversations.map((conv, index) => (
          <li key={conv.id} className="conversation-item flex justify-between p-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition duration-200">
              <span className="conv-index font-bold text-gray-800 block">{index + 1}&nbsp;&nbsp;</span>
            <div className="conv-details flex-1">
              <span className="conv-name font-bold text-gray-800 block">{conv.id}</span>
              <span className="conv-message text-sm text-gray-600">{conv.snippet}</span>
            </div>
            <span className="conv-time text-xs text-gray-500">{new Date(conv.updated_time).toLocaleString()}</span>
            <Link to={`/dashboard/conversation/${conv.id}`} className="reply-btn px-4 py-2 bg-blue-600 text-white rounded-full ml-4 hover:bg-blue-500 transition duration-300">
              View & Reply
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ConversationsList;
