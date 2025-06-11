import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddMeal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageUrl: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/CategoryControlller/AllCategories"
        );
        if (response.data.result && Array.isArray(response.data.result.data)) {
          setCategories(response.data.result.data);
        } else {
          throw new Error("Categories data is not an array");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Kategoriya yuklanmadi");
        toast.error("Kategoriya yuklashda xatolik yuz berdi.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity);
      const categoryId = parseInt(formData.categoryId);

      if (isNaN(price) || isNaN(quantity) || isNaN(categoryId)) {
        throw new Error(
          "Iltimos, narx, miqdor va kategoriyani to‘g‘ri kiriting"
        );
      }

      const response = await mealsApi.post("/Meal/AddMeal", {
        name: formData.name,
        price,
        quantity,
        categoryId,
        imageUrl: formData.imageUrl || "",
        description: formData.description || "",
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Ovqat muvaffaqiyatli qo‘shildi!");
        navigate("/dashboard/meals");
      } else {
        throw new Error("Serverdan noto‘g‘ri javob olindi");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Ovqat qo‘shishda xatolik: ${errorMessage}`);
      toast.error(`Ovqat qo‘shishda xatolik: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Yangi ovqat qo‘shish</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Ovqat nomi"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Narxi"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Miqdori"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          min="0"
          step="1"
        />
        <input
          type="file"
          name="imageUrl"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
          accept="image/*"
        />
        <textarea
          name="description"
          placeholder="Tavsif (ixtiyoriy)"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Kategoriya tanlang</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Qo‘shish
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMeal;
