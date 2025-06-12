import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserList from "./UserList";
import AddUserForm from "./UserList/AddUser";
import Sidebar from "./SideBar/index";
import EditUser from "./UserList/EditUser";
import Category from "./Category";
import EditCategory from "./Category/EditCategory";
import AddCategory from "./Category/AddCategory";
import AddMeal from "./Meal/AddMeal";
import Meals from "./Meal/Meals";
import EditMeal from "./Meal/EditMeal";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleMenuSelect = (view) => {
    if (view === "users") {
      navigate("/dashboard");
    } else if (view === "category") {
      navigate("/dashboard/category");
    } else if (view === "meals") {
      navigate("/dashboard/meals");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={handleToggleSidebar}
        onMenuSelect={handleMenuSelect}
        onLogout={handleLogout}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-4/5" : "w-full"
        } p-6`}
      >
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route
            path="add"
            element={
              <AddUserForm
                onUserAdded={() => {
                  toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!");
                  navigate("/dashboard");
                }}
              />
            }
          />
          <Route
            path="edit/:id"
            element={
              <EditUser
                onSave={() => {
                  navigate("/dashboard");
                }}
              />
            }
          />
          <Route path="category" element={<Category />} />
          <Route
            path="add-category"
            element={
              <AddCategory
                onSave={() => {
                  toast.success("Kategoriya muvaffaqiyatli qo'shildi!");
                  navigate("/dashboard");
                }}
              />
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <EditCategory
                onSave={() => {
                  toast.success("Kategoriya muvaffaqiyatli yangilandi!");
                  navigate("/dashboard/category");
                }}
              />
            }
          />
          <Route
            path="meals"
            element={
              <Meals
                onSave={() => {
                  toast.success("Ovqat muvaffaqiyatli saqlandi!");
                  navigate("/dashboard");
                }}
              />
            }
          />
          <Route path="add-meal" element={<AddMeal />} />
          <Route
            path="edit-meal/:id"
            element={
              <EditMeal
                onSave={() => {
                  toast.success("Ovqat muvaffaqiyatli yangilandi!");
                  navigate("/dashboard/meals");
                }}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
