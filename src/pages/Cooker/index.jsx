import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LayoutGrid, Settings, LogOut } from "lucide-react";
import { MealsProvider } from "../../context/MealContext";
import {jwtDecode} from "jwt-decode";

const Cooker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const sidebarItems = [
    {
      icon: <LayoutGrid />,
      label: "Bosh sahifa",
      active: location.pathname === "/cooker",
      onClick: () => navigate("/cooker"),
    },
    {
      icon: <Settings />,
      label: "Sozlamalar",
      active: location.pathname === "/cooker/settings",
      onClick: () => navigate("/cooker/settings"),
    },
  ];

  const token = localStorage.getItem("access_token");
  let name = "";
  let role = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      name = decoded?.name || "";
      role = decoded?.role || "";
      console.log("Decoded token:", decoded.name, decoded.role);
    } catch (err) {
      console.error("Token decoding error:", err);
    }
  }

  return (
    <MealsProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar
          type="cooker"
          title={name}
          onMenuClick={handleSidebarOpen}
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            toggleSidebar={handleClose}
            user={{ name, role }}
            items={sidebarItems}
            footerAction={{
              label: "Chiqish",
              onClick: handleLogout,
              icon: <LogOut className="w-4 h-4" />,
              bg: "bg-red-100",
              textColor: "red-500",
            }}
            fullWidth={true}
          />
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </MealsProvider>
  );
};

export default Cooker;
