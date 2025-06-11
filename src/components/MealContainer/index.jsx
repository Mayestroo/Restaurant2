import React, { useEffect, useState } from "react";
import getMeal from "../../api/meal";
import MealCard from './../MealCard';

const MealContainer = ({ selectedType, searchQuery, CardComponent = MealCard }) => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (selectedType) {
      console.log("Fetching meals for type:", selectedType);
      getMeal(token, setMeals, selectedType.id, null);
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
    <div className="meal-container w-[100vw] mt-52 px-3">
      <CardComponent meals={filteredMeals} />
    </div>
  );
};

export default MealContainer;
