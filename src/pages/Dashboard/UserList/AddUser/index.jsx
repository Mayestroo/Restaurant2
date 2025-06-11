import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    password: "",
    role: 1,
    permissions: [],
  });
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          axios.get("http://localhost:5500/api/Dashboard/AllRoles"),
          axios.get("http://localhost:5500/api/Dashboard/GetAllPermissions?skip=0&take=100"),
        ]);

        setRoles(rolesRes.data.result?.data || []);
        const perms = Array.isArray(permsRes.data.result?.data)
          ? permsRes.data.result.data
          : [];
        setPermissions(perms);
      } catch (error) {
        console.error("Failed to fetch roles or permissions:", error);
        toast.error("Rollar va ruxsatlar yuklashda xatolik yuz berdi.");
      }
    };
    fetchRolesAndPermissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedPermissions = checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value);
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      toast.error("Foydalanuvchi nomini kiriting.");
      return false;
    }
    if (!formData.fullName.trim()) {
      toast.error("To‘liq ismni kiriting.");
      return false;
    }
    if (!formData.password) {
      toast.error("Parolni kiriting.");
      return false;
    }
    if (!formData.role) {
      toast.error("Rolni tanlang.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5500/api/Dashboard/AddUser",
        {
          ...formData,
          role: parseInt(formData.role),
          permissions: formData.permissions,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Foydalanuvchi muvaffaqiyatli qo‘shildi.");
      onUserAdded();
      setFormData({
        userName: "",
        fullName: "",
        password: "",
        role: 1,
        permissions: [],
      });
    } catch (error) {
      console.error("Foydalanuvchi qo‘shishda xatolik:", error);
      toast.error(
        error.response?.data?.message || "Foydalanuvchi qo‘shishda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-8 max-w-3xl mx-auto rounded shadow">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Yangi foydalanuvchi qo‘shish
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Foydalanuvchi nomi
            </label>
            <input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Foydalanuvchi nomi"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              To‘liq ism
            </label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="To‘liq ism"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Parol
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Parol"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ruxsatlar
          </label>
          {permissions.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 max-h-60 overflow-auto border rounded p-3">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`permission-${permission.id}`}
                    value={permission.code}
                    checked={formData.permissions.includes(permission.code)}
                    onChange={handlePermissionsChange}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm text-gray-700"
                  >
                    {permission.fullName}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Ruxsatlar mavjud emas</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() =>
              setFormData({
                userName: "",
                fullName: "",
                password: "",
                role: 1,
                permissions: [],
              })
            }
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
            disabled={loading}
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Yuklanmoqda..." : "Foydalanuvchi qo‘shish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
