import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Conversation = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('user_name');
  // const messagesEndRef = useRef(null);
  useEffect(() => {
    const fetchMessages = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch messages from Laravel API
        const response = await axios.get(`/api/user/conversations/${id}/messages`, {
          params: {
            access_token: accessToken,
          },
        });
        setRecipientId(response.data.conversation[0].from.id);
        setMessages(response.data.conversation);
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
      await axios.post(`/api/user/send-message`, {
        message: newMessage,
        access_token: accessToken,
        recipient_id:recipientId,
      });
      // console.log('hello')
      setMessages([...messages, { message: newMessage, from: { username: username } }]);
    } catch (err) {
      setError('Failed to send message: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;
  const sortedMessages = messages.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));

  return (
    <div className="max-w-2xl mx-auto border rounded-lg shadow-lg">
      <div className="p-4 bg-gray-100 border-b">💬 Instagram Messages</div>
      <div className="h-[500px] overflow-y-scroll p-4 bg-white">
        {sortedMessages.map((msg, index) => (
          // <div key={index} className={`flex mb-4 `}>
          <div key={index} className={`flex mb-4 ${msg.from.username === 'vsvyv12' ? 'justify-end' : ''}`}>
            {msg.from.username !== 'vsvyv12' && (
              <div className="flex items-center space-x-2">
                <img src={`https://i.pravatar.cc/150?u=${msg.from.id}`} className="w-8 h-8 rounded-full" />
                <div className="bg-gray-100 p-2 rounded-xl">
                  <div className="text-xs text-gray-500">{msg.from.username}</div>
                  <div>{msg.message}</div>
                </div>
              </div>
            )}
            {msg.from.username === 'vsvyv12' && (
              <div className="bg-blue-500 text-white p-2 rounded-xl">
                <div>{msg.message}</div>
              </div>
            )}
          </div>
        ))} 
        {/* <div ref={messagesEndRef}></div> */}
      </div>
      <div className="p-4 border-t bg-gray-100 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
    //   <div className="send-message mt-4">
    //     <input
    //       type="text"
    //       value={newMessage}
    //       onChange={(e) => setNewMessage(e.target.value)}
    //       className="message-input p-2 border rounded w-full"
    //       placeholder="Type your message..."
    //     />
    //     <button onClick={handleSendMessage} className="send-btn px-4 py-2 bg-blue-600 text-white rounded-full mt-2 hover:bg-blue-500 transition duration-300">
    //       Send
    //     </button>
    //   </div>
    // </div>
  );
};

export default Conversation;
