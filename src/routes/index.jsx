import { lazy } from 'react';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import PublicRoute from '../components/auth/PublicRoute';

const User = lazy(() => import('../pages/User'));
const Login = lazy(() => import('../pages/Auth'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Waiter = lazy(() => import('../pages/Waiter'));
const Cooker = lazy(() => import('../pages/Cooker'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

export const routes = [
  { path: '/', element: <User /> },

  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: '/dashboard/*',
    element: (
      <RoleBasedRoute allowedRoles={[1, 4]}>
        <Dashboard />
      </RoleBasedRoute>
    ),
  },

  {
    path: '/waiter',
    element: (
      <RoleBasedRoute allowedRoles={[2]}>
        <Waiter />
      </RoleBasedRoute>
    ),
  },

  {
    path: '/cooker',
    element: (
      <RoleBasedRoute allowedRoles={[3]}>
        <Cooker />
      </RoleBasedRoute>
    ),
  },

  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
];
