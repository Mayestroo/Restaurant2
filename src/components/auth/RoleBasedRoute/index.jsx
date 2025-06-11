import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roleIdRaw = payload?.roleId || payload?.RoleId || payload?.RoleID;
    const roleId = Number(roleIdRaw);

    if (allowedRoles.includes(roleId)) {
      return children;
    } else {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRoute;
