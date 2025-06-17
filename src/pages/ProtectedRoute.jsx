// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // or any key you stored
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  if (auth === null) return null; // Optional: return a loading spinner
  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
