import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token1');
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
