import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditMeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    imageUrl: "",
    description: "",
  });
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/api/CategoryControlller/AllCategories"
      );
      const result = response.data.result;

      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        throw new Error("Categories data is not an array");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to load categories");
      toast.error("Kategoriya yuklashda xatolik yuz berdi.");
    }
  };

  const fetchMeal = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.245:5063/api/Meal/MealById?mealId=${id}`
      );
      if (response.data.statusCode === 200 && response.data.result) {
        const data = response.data.result;
        setFormData({
          name: data.name || "",
          price: data.price || 0,
          quantity: data.quantity || 0,
          categoryId: data.categoryId || "",
          imageUrl: data.imageUrl || "",
          description: data.description || "",
        });
      } else {
        throw new Error("Invalid meal data");
      }
    } catch (error) {
      console.error("Failed to fetch meal:", error);
      setError("Failed to load meal");
      toast.error("Ovqat ma'lumotlarini yuklashda xatolik yuz berdi.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "categoryId"
          ? Number(value)
          : value,
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
      const quantity = parseInt(formData.quantity, 10);
      const categoryId = parseInt(formData.categoryId, 10);

      if (isNaN(price) || isNaN(quantity) || isNaN(categoryId)) {
        throw new Error(
          "Iltimos, narx, miqdor va kategoriya uchun to‘g‘ri son kiriting."
        );
      }

      const response = await axios.put(
        `http://192.168.1.245:5063/api/Meal/UpdateMeal?mealId=${id}`,
        {
          name: formData.name,
          price,
          quantity,
          categoryId,
          imageUrl: formData.imageUrl || "",
          description: formData.description || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Ovqat muvaffaqiyatli yangilandi.");
        navigate("/dashboard/meals");
      }
    } catch (error) {
      console.error("Failed to update meal:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Ovqatni yangilashda xatolik: ${errorMessage}`);
      toast.error(`Ovqatni yangilashda xatolik: ${errorMessage}`);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMeal();
  }, [id]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Ovqatni tahrirlash</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          placeholder="Ovqat nomi"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          placeholder="Narxi (so'm)"
          min="0"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          placeholder="Miqdori"
          min="0"
          required
        />
        <input
          type="file"
          name="imageUrl"
          onChange={handleImageChange}
          className="border w-full p-2 rounded"
          accept="image/*"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          placeholder="Tavsif (ixtiyoriy)"
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        >
          <option value="">Kategoriya tanlang</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Yangilash
        </button>
      </form>
    </div>
  );
};

export default EditMeal;
