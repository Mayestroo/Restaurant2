import React, { useState } from "react";
import { X, Menu } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  toggleSidebar,
  user,
  title,
  items = [],
  footerAction,
  fullWidth = true,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.id === "sidebar-overlay") {
      onClose?.();
    }
  };

  return (
    <>
      {fullWidth && isOpen && (
        <div
          id="sidebar-overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-[#5D7FC1]/50 bg-opacity-30 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white z-50 transition-transform shadow
          ${fullWidth ? "w-64" : isOpen ? "w-64" : "w-20"}
          ${!fullWidth && "bg-gray-900 text-white"}
          ${isOpen ? "translate-x-0" : fullWidth ? "-translate-x-full" : ""}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              {isOpen && (
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.role}</p>
                </div>
              )}
            </div>
          ) : (
            <h1 className={`text-xl font-bold ${!fullWidth && "text-white"}`}>
              {title}
            </h1>
          )}

          <button
            onClick={toggleSidebar || onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${fullWidth ? "bg-red-100" : "text-white"}`}
          >
            {isOpen ? (
              <X size={20} className="text-red-600" />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                item.onClick?.(); 
                onClose?.(); 
              }}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer
                ${
                  item.active
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-black"
                }
                ${!fullWidth && "text-white hover:text-gray-400 hover:bg-gray-800"}`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full
                  ${item.active ? "bg-blue-600 text-white" : "bg-gray-200"}
                  ${!fullWidth && "bg-gray-800 text-white"}`}
              >
                {item.icon}
              </div>
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {footerAction && (
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg
                ${footerAction.bg || "bg-gray-100"} text-${
                footerAction.textColor || "red-500"
              }`}
            >
              <span>{footerAction.label}</span>
              {footerAction.icon}
            </button>
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 min-w-[300px]">
            <h2 className="text-lg font-semibold mb-4 text-center">Chiqishni tasdiqlaysizmi?</h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  footerAction?.onClick();
                }}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
