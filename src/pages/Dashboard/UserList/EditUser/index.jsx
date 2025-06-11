import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditUser = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
    permissions: [],
  });
  const [roleOptions, setRoleOptions] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const [rolesRes, permsRes, userRes] = await Promise.all([
          axios.get("http://localhost:5500/api/Dashboard/AllRoles"),
          axios.get(`http://localhost:5500/api/Dashboard/GetAllPermissions?userId=${id}&skip=0&take=100`),
          axios.get(`http://localhost:5500/api/Dashboard/GetUserById?userId=${id}`),
        ]);

        const roles = rolesRes.data.result?.data || [];
        const permissions = permsRes.data.result?.data || [];
        const user = userRes.data.result;

        setRoleOptions(roles);
        setPermissionOptions(permissions);

        if (user) {
          setFormData({
            userName: user.username || "",
            password: "",
            role: user.role || "",
            permissions: Array.isArray(user.permissions) ? user.permissions : [],
          });
        }
      } catch (err) {
        toast.error("Malumotlarni yuklashda xatolik yuz berdi: " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePermissionChange = (permCode) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permCode)
        ? prev.permissions.filter((p) => p !== permCode)
        : [...prev.permissions, permCode];
      return { ...prev, permissions: newPermissions };
    });
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      toast.error("Foydalanuvchi nomi kiritilishi shart");
      return false;
    }
    if (!formData.role) {
      toast.error("Rol tanlanishi shart");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        userName: formData.userName,
        password: formData.password || undefined,
        role: parseInt(formData.role, 10),
        permissions: formData.permissions,
      };

      const res = await axios.put(
        "http://localhost:5500/api/Dashboard/UpdateUser",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        toast.success("Foydalanuvchi muvaffaqiyatli yangilandi");
        onSave?.();
        navigate("/dashboard");
      } else {
        throw new Error("Yangilashda xatolik yuz berdi");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(`Xatolik: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!id) return null;

  return (
    <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Foydalanuvchini tahrirlash: {formData.userName}</h3>
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Foydalanuvchi nomi</label>
            <input
              type="text"
              value={formData.userName}
              autoComplete="username"
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parol</label>
            <input
              type="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="O‘zgartirmoqchi bo‘lsangiz parol kiriting"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled={loading}
            >
              <option value="">Rolni tanlang</option>
              {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ruxsatlar</label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-60 overflow-auto border rounded p-3">
              {permissionOptions.map((perm) => (
                <div key={perm.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={perm.code}
                    checked={formData.permissions.includes(perm.code)}
                    onChange={() => handlePermissionChange(perm.code)}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{perm.fullName}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              Saqlash
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditUser;
