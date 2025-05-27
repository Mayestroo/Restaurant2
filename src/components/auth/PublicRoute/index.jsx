import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roleId = Number(payload?.roleId || payload?.RoleId || payload?.RoleID);

      if (roleId === 1 || roleId === 4) return <Navigate to="/dashboard" replace />;
      if (roleId === 2) return <Navigate to="/waiter" replace />;
      if (roleId === 3) return <Navigate to="/cooker" replace />;
    } catch {
      // invalid token — allow login
    }
  }

  return children;
};

export default PublicRoute;
