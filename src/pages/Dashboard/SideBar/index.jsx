import React from "react";
import { Menu, X, Users, Folder, Utensils } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, onMenuSelect }) => {
  return (
    <div
      className={`bg-gray-900 text-white p-6 transition-all duration-500 ease-in-out shadow-lg ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col  h-screen`}
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
    </div>
  );
};

export default Sidebar;