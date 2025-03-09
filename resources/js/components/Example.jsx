import React, { useState } from 'react';
import './../../css/app.css';  // Import Tailwind CSS

function Example() {
    console.log("Example component rendered"); // Debug log

    const [loading, setLoading] = useState(false); // Loading state for API calls
    const [error, setError] = useState(null); // Error handling

    // Instagram API credentials (replace with your actual values)
    const CLIENT_ID = 1665027280807295; // From Instagram Developer Portal
    const REDIRECT_URI = 'https://b6ad-2401-4900-a8b1-a9aa-9ce1-8fea-b5e6-dc5c.ngrok-free.app/callback'; // Must match your app's redirect URI

    const AUTH_URL = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;

    const handleLogin = () => {
        window.location.href = AUTH_URL; 
    };

    return (
        <div className="container mx-auto p-4 font-sans bg-gray-100 min-h-screen">
            <div className="login-section text-center p-12 bg-white rounded-lg shadow-md max-w-md mx-auto mt-12">
                <h2 className="title text-2xl text-gray-800 mb-4">Welcome to the App</h2>
                <p className="subtitle text-lg text-gray-600 mb-6">Login with Instagram to get started</p>
                <button className="login-btn px-6 py-3 bg-pink-600 text-white rounded-full text-lg hover:bg-pink-500 transition duration-300" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login with Instagram'}
                </button>
                {error && <p className="error text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default Example;