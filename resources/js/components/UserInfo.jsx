import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserInfo = () => {
  const [user, setUser] = useState(null);
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
        // console.log(response.data.userinfo);
        setUser(response.data.userinfo);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data: ' + (err.response?.data?.error?.message || err.message));
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
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
        </div>
      )}
    </div>
  );
};

export default UserInfo;
