import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LayoutGrid, ShoppingCart, Settings, LogOut } from "lucide-react";
import { WaiterMealProvider } from "../../context/WaiterMealContext";

const Waiter = () => {
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
      label: "Menu",
      active: location.pathname === "/waiter",
      onClick: () => navigate("/waiter"),
    },
    {
      icon: <ShoppingCart />,
      label: "Buyurtmalar",
      active: location.pathname === "/waiter/orders",
      onClick: () => navigate("/waiter/orders"),
    },
    {
      icon: <Settings />,
      label: "Sozlamalar",
      active: location.pathname === "/waiter/settings",
      onClick: () => navigate("/waiter/settings"),
    },
  ];



  return (
    <WaiterMealProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar
          type="waiter"
          onMenuClick={handleSidebarOpen}
          showAddOrder
          title="Buyurtmalar"
          subtitle="Buyurtmalar navbati"
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            user={{ name: "Ashurbek", role: "ofitsant" }}
            items={sidebarItems}
            footerAction={{
              label: "Log Out",
              onClick: handleLogout,
              icon: <LogOut className="w-4 h-4" />,
            }}
            fullWidth={true}
          />
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </WaiterMealProvider>
  );
};

export default Waiter;
