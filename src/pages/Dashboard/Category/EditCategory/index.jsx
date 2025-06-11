import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditCategory = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5050/api/CategoryControlller";

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/CategoryById?categoryId=${id}`, {
          headers: { Accept: "text/plain" },
        });
        if (response.data.statusCode === 200 && response.data.result) {
          setCategory({ name: response.data.result.name || "" });
        } else {
          toast.error(response.data.error?.message || "Kategoriya topilmadi");
        }
      } catch (err) {
        toast.error("Kategoriya yuklashda xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/UpdateCategory?categoryId=${id}`,
        { name: category.name },
        {
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        onSave();
        setTimeout(() => navigate("/dashboard/category"), 1500);
      } else {
        toast.error(response.data.error?.message || "Kategoriya yangilashda xatolik");
      }
    } catch (err) {
      toast.error("Kategoriya yangilashda xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-700">
        Kategoriya yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6">Kategoriya tahrirlash</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
            Kategoriya nomi
          </label>
          <input
            id="name"
            type="text"
            value={category.name}
            onChange={handleChange}
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
            className={`px-4 py-2 text-white rounded ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saqlanmoqda..." : "Yangilash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
