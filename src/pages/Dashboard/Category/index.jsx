import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/api/CategoryControlller/AllCategories?skip=0&take=100&t=${Date.now()}`
      );
      const categoryArray = response.data.result?.data || [];
      if (!Array.isArray(categoryArray)) {
        throw new Error("Invalid categories data");
      }
      setCategories(categoryArray);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Kategoriya yuklashda xatolik yuz berdi.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await axios.delete(
        `http://localhost:5050/api/CategoryControlller/Category?categoryId=${categoryId}`
      );
      toast.success("Kategoriya muvaffaqiyatli o‘chirildi.");
      setShowModal(false);
      setCategoryToRemove(null);
      fetchCategories();
    } catch (error) {
      console.error("Error removing category:", error);
      toast.error("Kategoriya o‘chirishda xatolik yuz berdi.");
    }
  };

  const handleRemoveClick = (categoryId) => {
    if (!categoryId) {
      toast.error("Xato: Noto‘g‘ri kategoriya ID.");
      return;
    }
    setCategoryToRemove(categoryId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-semibold">All Categories</h2>
        <button
          className="hover:text-blue-600 hover:bg-white font-medium border border-blue-600 hover:border-blue-800 bg-blue-600 text-white rounded px-4 py-2 mt-4 sm:mt-0 cursor-pointer"
          onClick={() => navigate("/dashboard/add-category")}
          aria-label="Add Category"
        >
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Yuklanmoqda...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">Kategoriya topilmadi.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Category Name
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {category.name || "No name available"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button
                      aria-label={`Edit category ${category.name}`}
                      onClick={() =>
                        navigate(`/dashboard/edit-category/${category.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      aria-label={`Remove category ${category.name}`}
                      onClick={() => handleRemoveClick(category.id)}
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
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this category?
            </h3>
            <p className="mb-6 text-gray-700">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={() => removeCategory(categoryToRemove)}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                aria-label="Confirm delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
