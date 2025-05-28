import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LayoutGrid, ShoppingCart, Settings, LogOut } from "lucide-react";
import { MealsProvider } from "../../context/MealContext";

const Cooker = () => {
  // For desktop, start open
  const [isOpen, setIsOpen] = useState(true);
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
      icon: <ShoppingCart />,
      label: "Buyurtmalar",
      active: location.pathname === "/cooker/orders",
      onClick: () => navigate("/cooker/orders"),
    },
    {
      icon: <Settings />,
      label: "Sozlamalar",
      active: location.pathname === "/cooker/settings",
      onClick: () => navigate("/cooker/settings"),
    },
  ];

  return (
    <MealsProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar
          type="cooker"
          title="Oshpazlar"
          subtitle="Oshpazlar navbati"
          onMenuClick={handleSidebarOpen}
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            toggleSidebar={handleClose}
            user={{ name: "Ashurbek", role: "oshpaz" }}
            items={sidebarItems}
            footerAction={{
              label: "Log Out",
              onClick: handleLogout,
              icon: <LogOut className="w-4 h-4" />,
              bg: "bg-red-100",
              textColor: "red-500",
            }}
            fullWidth={true} // Always open on desktop
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
