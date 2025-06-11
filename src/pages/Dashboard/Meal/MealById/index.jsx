import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MealById = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://192.168.1.245:5063/api/Meal";

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/MealById?mealId=${mealId}`, {
          headers: { Accept: "text/plain" },
        });

        if (response.data.statusCode === 200 && response.data.result) {
          setMeal(response.data.result);
        } else {
          const errMsg = response.data.error || "Ovqatni olishda xatolik yuz berdi.";
          toast.error(errMsg);
          setMeal(null);
        }
      } catch (error) {
        toast.error("Ovqatni olishda xatolik: " + error.message);
        setMeal(null);
      } finally {
        setLoading(false);
      }
    };

    if (mealId) {
      fetchMeal();
    }
  }, [mealId]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-blue-600">
        Yuklanmoqda...
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="text-center mt-10 text-red-600">
        Ovqat topilmadi.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Ovqat haqida ma'lumot</h2>
      {meal.imageUrl ? (
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
          <span className="text-gray-500">Rasm mavjud emas</span>
        </div>
      )}
      <p><strong>Nomi:</strong> {meal.name}</p>
      <p><strong>Narxi:</strong> {meal.price?.toLocaleString()} so'm</p>
      <p><strong>Miqdori:</strong> {meal.quantity}</p>
      <p><strong>Kategoriya ID:</strong> {meal.categoryId}</p>
      {meal.description && (
        <p className="mt-2"><strong>Tavsif:</strong> {meal.description}</p>
      )}
    </div>
  );
};

export default MealById;
