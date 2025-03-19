import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [media, setMedia] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/user/info', {
          params: {
            access_token: accessToken
          }
        });
        localStorage.setItem('user_id', response.data.userinfo.id);
        localStorage.setItem('user_name', response.data.userinfo.username);
        setUser(response.data.userinfo);
        setMedia(response.data.media.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data: ' + (err.response?.data?.error?.message || err.message));
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchComments = async (mediaId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`/api/comments/${mediaId}`, {
        params: { access_token: accessToken },
      });
      setComments(response.data.comments.data);
      const selected = media.find(item => item.id === mediaId);
      setSelectedMedia(selected);
    } catch (err) {
      setError('Failed to fetch comments: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const handleReply = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`/api/comments/${selectedMedia.id}/reply`, {
        access_token: accessToken,
        comment_text: newComment,
      });
      setNewComment('');
      fetchComments(selectedMedia.id); // Refresh comments
    } catch (err) {
      setError('Failed to reply to comment: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const handleBack = () => {
    setSelectedMedia(null);
    setComments([]);
  };

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-100 min-h-screen">
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-12">
          <div className="flex items-center space-x-4">
            <img src={user.profile_picture_url} alt="Profile" className="rounded-full w-32 h-32" />
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-600">{user.name}</p>
              <p className="text-gray-600">User ID: {user.id}</p>
              <p className="text-gray-600">Account Type: {user.account_type}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-around">
            <div className="text-center">
              <p className="text-xl font-bold">{user.media_count}</p>
              <p className="text-gray-600">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{user.followers_count}</p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{user.follows_count}</p>
              <p className="text-gray-600">Following</p>
            </div>
          </div>
          {!selectedMedia && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={index} className="relative" onClick={() => fetchComments(item.id)}>
                  {item.media_type === 'IMAGE' ? (
                    <img src={item.media_url} alt={`Media ${index}`} className="w-full h-full object-cover" />
                  ) : (
                    <video controls className="w-full h-full object-cover">
                      <source src={item.media_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <p className="text-gray-600 text-sm mt-2">{item.caption}</p>
                </div>
              ))}
            </div>
          )}
          {selectedMedia && (
            <div className="mt-6">
              <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition duration-300">
                Back
              </button>
              <div className="relative">
                {selectedMedia.media_type === 'IMAGE' ? (
                  <img src={selectedMedia.media_url} alt={`Media ${selectedMedia.id}`} className="w-full h-full object-cover" />
                ) : (
                  <video controls className="w-full h-full object-cover">
                    <source src={selectedMedia.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <p className="text-gray-600 text-sm mt-2">{selectedMedia.caption}</p>
              </div>
              <h2 className="text-xl font-bold mt-4">Comments</h2>
              <div className="comments-list mt-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item mb-4">
                    <p className="text-gray-800">{comment.username}</p>
                    <p className="text-gray-600">{comment.text}</p>
                    <p className="text-gray-400 text-xs">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="reply-form mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="p-2 border rounded w-full"
                  placeholder="Type your reply..."
                />
                <button onClick={handleReply} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-300">
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;