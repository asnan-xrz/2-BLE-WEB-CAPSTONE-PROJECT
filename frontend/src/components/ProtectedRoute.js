import React from 'react';
import { Navigate } from 'react-router-dom';

// Fungsi untuk memeriksa role dari token di localStorage
const checkRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Decode JWT token untuk mendapatkan role pengguna
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  return decodedToken.role; // Mengembalikan role pengguna dari token
};

// ProtectedRoute untuk Admin Dashboard dan Lecturer Dashboard
const ProtectedRoute = ({ element, roles }) => {
  const userRoles = checkRole(); // Dapatkan role pengguna dari token

  // Jika userRoles tidak ada atau tidak cocok dengan roles yang diberikan
  if (!userRoles || !userRoles.some(role => roles.includes(role))) {
    return <Navigate to="/login" />;
  }

  // Jika role cocok, tampilkan elemen yang sesuai
  return element;
};

export default ProtectedRoute;
