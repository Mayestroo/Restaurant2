import React, { useState } from "react";
import { Menu, X, Users, Folder, Utensils, LogOut } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, onMenuSelect, onLogout }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);
  const handleConfirm = () => {
    setShowModal(false);
    onLogout(); // Call parent logout logic
  };

  return (
    <div
      className={`bg-gray-900 text-white p-6 transition-all duration-500 ease-in-out shadow-lg ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col h-screen relative`}
    >
      <button
        onClick={toggleSidebar}
        className="mb-6 text-gray-300 hover:text-white transition"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <>
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          <ul className="space-y-4">
            <li
              className="cursor-pointer flex items-center gap-3 text-lg hover:text-gray-400 transition"
              onClick={() => onMenuSelect("users")}
            >
              <Users size={20} /> Users
            </li>
            <li
              className="cursor-pointer flex items-center gap-3 text-lg hover:text-gray-400 transition"
              onClick={() => onMenuSelect("category")}
            >
              <Folder size={20} /> Category
            </li>
            <li
              className="cursor-pointer flex items-center gap-3 text-lg hover:text-gray-400 transition"
              onClick={() => onMenuSelect("meals")}
            >
              <Utensils size={20} /> Meals
            </li>
          </ul>
        </>
      )}

      <div className="flex-grow" />

      {/* Logout Button */}
      <button
        onClick={handleLogoutClick}
        className={`flex items-center gap-2 text-lg mt-6 cursor-pointer text-red-400 hover:text-red-500 transition px-2 py-2 rounded ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        <LogOut size={22} />
        {isOpen && <span>Logout</span>}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-xl w-[90vw] max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="mb-6 text-gray-700">Do you really want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
