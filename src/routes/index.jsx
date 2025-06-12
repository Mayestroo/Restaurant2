import { lazy } from "react"; // ✅ Removed Children
import RoleBasedRoute from "../components/auth/RoleBasedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import OrderHub from "../pages/Waiter/OrderHub";
import WaiterSettings from "../pages/Waiter/Settings";
import WaiterMenu from "../pages/Waiter/Menu";

const User = lazy(() => import("../pages/User"));
const Login = lazy(() => import("../pages/Auth"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Waiter = lazy(() => import("../pages/Waiter"));
const Cooker = lazy(() => import("../pages/Cooker"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
import CookerHub from "./../pages/Cooker/CookerHub/index";
import ActiveOrders from "../pages/Waiter/OrderHub/ActiveOrders";
import ClosedOrders from "../pages/Waiter/OrderHub/ClosedOrders";
import { Navigate } from "react-router-dom";
import CurrentOrders from "../pages/Waiter/OrderHub/CurrentOrders";

export const routes = [
  { path: "/", element: <User /> },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/dashboard/*",
    element: (
      <RoleBasedRoute allowedRoles={[1, 4]}>
        <Dashboard />
      </RoleBasedRoute>
    ),
  },

  {
    path: "/waiter",
    element: (
      <RoleBasedRoute allowedRoles={[2]}>
        <Waiter />
      </RoleBasedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="menu" replace />
      },
      {
        path: "menu",
        element: <WaiterMenu />
      },
      {
        path: "orders",
        element: <OrderHub />,
        children: [
          {
            path: "activeorders",
            element: <ActiveOrders />,
          },
          {
            path: "currentorders",
            element: <CurrentOrders />
          },
          {
            path: "closedorders",
            element: <ClosedOrders />
          },
          {
            index: true,
            element: <Navigate to="activeorders" replace />,
          },
        ],
      },

      { path: "settings", element: <WaiterSettings /> },
    ],
  },

  {
    path: "/cooker",
    element: (
      <RoleBasedRoute allowedRoles={[3]}>
        <Cooker />
      </RoleBasedRoute>
    ),
    children: [{ index: true, element: <CookerHub /> }],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];
