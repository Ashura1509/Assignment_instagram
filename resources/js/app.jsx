import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Example from './components/Example'; // Ensure the correct path to Example component
import Callback from './components/Callback'; // Ensure the correct path to Callback component
import Dashboard from './components/Dashboard'; // Ensure the correct path to Dashboard component
import UserInfo from './components/UserInfo'; // Ensure the correct path to UserInfo component
import Messages from './components/Messages'; // Ensure the correct path to Messages component
import Conversation from './components/Conversation'; // Ensure the correct path to Conversation component
import '../css/app.css'; // This will load the tailwind styles

console.log("Rendering Example component"); // Debug log

ReactDOM.createRoot(document.getElementById('example')).render(
  <Router>
    <Routes>
      <Route path="/" element={<Example />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="user-info" element={<UserInfo />} />
        <Route path="conversation" element={<Messages />} />
        <Route path="conversation/:id" element={<Conversation />} />
      </Route>
    </Routes>
  </Router>
);