import React, { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:5225/api/Dashboard/GetAllUsers?skip=0&take=100&t=${Date.now()}`
      );
      const data = await res.json();
      const userArray = data.result?.data || [];
      setUsers(Array.isArray(userArray) ? userArray : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Foydalanuvchilarni yuklashda xatolik yuz berdi");
      setUsers([]);
    }
  };

  // Remove user by userId
  const removeUser = async (userId) => {
    if (!userId) {
      toast.error("Foydalanuvchini o'chirishda xatolik: noto'g'ri ID");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5225/api/Dashboard/RemoveUser?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error(`Foydalanuvchini o'chirishda xatolik: ${res.statusText}`);
      toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
      setShowModal(false);
      setUserToRemove(null);
      fetchUsers();
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
    }
  };

  // Store userId when delete button is clicked
  const handleRemoveClick = (userId) => {
    if (!userId) {
      toast.error("Noto'g'ri foydalanuvchi IDsi. Iltimos qayta urinib ko'ring.");
      return;
    }
    setUserToRemove(userId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-semibold">Barcha foydalanuvchilar</h2>
        <button
          className="hover:text-blue-600 hover:bg-white font-medium border border-blue-600 hover:border-blue-800 bg-blue-600 text-white rounded px-4 py-2 mt-4 sm:mt-0 cursor-pointer"
          onClick={() => navigate("/dashboard/add")}
        >
          Foydalanuvchi qo'shish
        </button>
      </div>
      {users.length === 0 ? (
        <p>Foydalanuvchilar topilmadi.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Foydalanuvchi nomi
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.userId || idx} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.username || "Ism mavjud emas"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      aria-label="Foydalanuvchini tahrirlash"
                      onClick={() => navigate(`/dashboard/edit/${user.id}`)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      aria-label="Foydalanuvchini o'chirish"
                      onClick={() => handleRemoveClick(user.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Foydalanuvchini o'chirishni tasdiqlaysizmi?</h3>
            <p className="mb-6">Ushbu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => removeUser(userToRemove)}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
