import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import LecturerDashboard from './components/LecturerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

// Home Component
const Home = () => (
  <div className="home-container">
    <h2>Welcome to the Home Page</h2>
    <p>To get started, please choose one of the options below:</p>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token to get user info
      setUser({ email: decodedToken.email, role: decodedToken.role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="App">
      <header>
        <div className="user-status">
          {user ? (
            <div>
              <span>{user.email} logged in as {user.role}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <span>Please log in</span>
          )}
        </div>
      </header>

      <div className="nav-container">
        {/* Navigation Buttons for Login and Register */}
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Use ProtectedRoute for Admin and Lecturer Dashboards */}
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute element={<AdminDashboard />} roles={['admin']} />} 
        />
        
        <Route 
          path="/lecturer-dashboard" 
          element={<ProtectedRoute element={<LecturerDashboard />} roles={['admin', 'lecturer']} />} 
        />
        
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);
