import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LayoutGrid, ShoppingCart, Settings, LogOut } from "lucide-react";
import { WaiterMealProvider } from "../../context/WaiterMealContext";
import { jwtDecode } from "jwt-decode";

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

  const token = localStorage.getItem("access_token");
  let name = "";
  let role = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      name = decoded?.name || "";
      role = decoded?.role || "";
    } catch (err) {
      console.error("Token decoding error:", err);
    }
  }

  const sidebarItems = [
    {
      icon: <LayoutGrid />,
      label: "Menu",
      active: location.pathname === "/waiter/menu",
      onClick: () => navigate("/waiter/menu"),
    },
    {
      icon: <ShoppingCart />,
      label: "Buyurtmalar",
      active: /^\/waiter\/orders(\/.*)?$/.test(location.pathname),
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
          title={name}
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={isOpen}
            onClose={handleClose}
            user={{ name, role }}
            items={sidebarItems}
            footerAction={{
              label: "Chiqish",
              onClick: handleLogout,
              icon: <LogOut className="w-4 h-4" />,
            }}
            fullWidth={true}
          />
          <main className="overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </WaiterMealProvider>
  );
};

export default Waiter;
