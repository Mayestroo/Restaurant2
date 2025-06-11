import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch category data for editing
  useEffect(() => {
    if (isEdit) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`http://localhost:5050/api/CategoryControlller/CategoryById?id=${id}`);
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const data = await res.json();
          const result = data.result;
          if (result && result.name) {
            setName(result.name);
          } else {
            toast.error("Kategoriya topilmadi");
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          toast.error("Kategoriya yuklashda xatolik yuz berdi");
        }
      };
      fetchCategory();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { name };

    try {
      const url = isEdit
        ? "http://localhost:5050/api/CategoryControlller/UpdateCategory"
        : "http://localhost:5050/api/CategoryControlller/AddCategory";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isEdit ? { id, ...payload } : payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "So'rovda xatolik yuz berdi");
      }

      toast.success(isEdit ? "Kategoriya muvaffaqiyatli yangilandi" : "Kategoriya muvaffaqiyatli qo'shildi");
      navigate("/dashboard/category");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Kategoriya saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Kategoriya tahrirlash" : "Yangi kategoriya qo'shish"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Kategoriya nomi
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kategoriya nomi"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/category")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Qo'shish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
