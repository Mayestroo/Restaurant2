import React, { useEffect, useState } from "react";
import getMeal from "../../api/meal";
import MealCard from "../MealCard";

const MealContainer = ({ selectedType, searchQuery, CardComponent = MealCard }) => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

useEffect(() => {
  const fetchMeals = async () => {
    try {
      const categoryId = selectedType?.name === "Hammasi" ? null : selectedType?.id;
      const result = await getMeal(token, categoryId);
      setMeals(result || []);
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to fetch meals. Please try again.");
    }
  };

  if (selectedType) {
    fetchMeals();
  }
}, [selectedType, token]);


  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMeals(meals);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = meals.filter((meal) =>
        meal.name.toLowerCase().includes(lowerQuery)
      );
      setFilteredMeals(filtered);
    }
  }, [meals, searchQuery]);

  return (
    <div className="meal-container w-full mt-72 px-3">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {filteredMeals.length > 0 ? (
        <CardComponent meals={filteredMeals} />
      ) : (
        !error && (
          <p className="text-gray-500 text-center mt-8">
            Mos keluvchi taomlar topilmadi
          </p>
        )
      )}
    </div>
  );
};

export default MealContainer;
