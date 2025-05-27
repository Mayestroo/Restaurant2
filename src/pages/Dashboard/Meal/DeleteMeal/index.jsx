import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteMeal = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(true);

  const API_BASE_URL = "http://192.168.1.245:5063/api/Meal";

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/MealById?mealId=${mealId}`
        );

        if (response.data.statusCode === 200 && response.data.result) {
          setMeal(response.data.result);
        } else {
          throw new Error("Meal not found");
        }
      } catch (err) {
        setError("Failed to load meal: " + err.message);
        toast.error("Failed to load meal");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [mealId]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/Meal?mealId=${mealId}`, {
        headers: { Accept: "text/plain" },
      });

      if (response.data.statusCode === 200) {
        toast.success("Meal deleted successfully");
        setShowConfirm(false);
        setTimeout(() => navigate("/dashboard/meals"), 1500);
      } else {
        throw new Error(response.data.error || "Failed to delete meal");
      }
    } catch (err) {
      setError("Failed to delete meal: " + err.message);
      toast.error("Failed to delete meal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/meals");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (showConfirm && meal) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">Confirm Delete Meal</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete &quot;{meal.name}&quot;? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            aria-label="Confirm deletion"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default DeleteMeal;
