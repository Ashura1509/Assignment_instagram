import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';




const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 font-sans bg-gray-100 min-h-screen">
      <nav className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Link to="/dashboard/user-info" className="mr-4 text-blue-600 hover:underline">User Info</Link>
        <Link to="/dashboard/conversation" className="mr-4 text-blue-600 hover:underline">Conversations</Link>
        {/* <Link to="/dashboard/send-message" className="text-blue-600 hover:underline">Send Message</Link> */}
      </nav>
      <Outlet />
    </div>
  );
};

export default Dashboard;
