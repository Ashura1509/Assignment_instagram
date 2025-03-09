import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      localStorage.setItem('authCode', code);    
      console.log('Callback received and code saved to local storage!');

      // Call the Laravel API to exchange the code for a long-lived access token
      axios.post('/api/instagram/login', { code })
        .then(response => {
          const longLivedToken = response.data.access_token;
          const short_lived_token = response.data.data2.access_token;
          localStorage.setItem('accessToken', longLivedToken);
          localStorage.setItem('short_lived_token', short_lived_token);
          console.log('Long-lived token received and saved to local storage!');
          
          // Redirect to dashboard after saving the long-lived token
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
        });
    } else {
      // Redirect to dashboard if no code is found
      navigate('/dashboard');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
