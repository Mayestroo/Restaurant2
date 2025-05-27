import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const WaiterMealContext = createContext();

// Context Provider
export const WaiterMealProvider = ({ children }) => {
  const [addedMeals, setAddedMeals] = useState(() => {
    try {
      const data = localStorage.getItem("addedMeals");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("waiter_addedMeals", JSON.stringify(addedMeals));
    } catch (e) {
      console.warn("Error saving meals:", e);
    }
  }, [addedMeals]);

  // Function to add a meal
  const addMeal = (meal) => {
    setAddedMeals((prev) => {
      const idx = prev.findIndex((m) => m.id === meal.id);
      if (idx > -1) {
        return prev.map((m, i) =>
          i === idx ? { ...m, quantity: (m.quantity || 1) + 1 } : m
        );
      } else {
        return [...prev, { ...meal, quantity: meal.quantity || 1 }];
      }
    });
  };

  // Function to remove a meal
  const removeMeal = (id) => {
    setAddedMeals((prev) => {
      return prev
        .map((m) => (m.id === id ? { ...m, quantity: m.quantity - 1 } : m))
        .filter((m) => m.quantity > 0);
    });
  };

  return (
    <WaiterMealContext.Provider
      value={{ addedMeals, setAddedMeals, addMeal, removeMeal }}
    >
      {children}
    </WaiterMealContext.Provider>
  );
};

// Custom hook for context access
export const useWaiterMeals = () => {
  const context = useContext(WaiterMealContext);
  if (!context) {
    throw new Error("useWaiterMeals must be used inside WaiterMealProvider");
  }
  return context;
};
