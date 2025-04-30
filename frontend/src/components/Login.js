import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the email and password to backend for login
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Cek jika response tidak berhasil
      if (!response.data.token) {
        throw new Error('Failed to login. No token received.');
      }

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Store user data (role) as well, so we can check it in the frontend
      localStorage.setItem('role', response.data.role); // Ensure role is also stored

      // Redirect to the appropriate dashboard based on the user's role
      if (response.data.role.includes('admin')) {
        navigate('/admin-dashboard');
      } else if (response.data.role.includes('lecturer')) {
        navigate('/lecturer-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Welcome Back!</h1>
        <p>Please log in to your account</p>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
