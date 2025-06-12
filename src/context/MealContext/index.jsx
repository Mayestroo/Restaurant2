import { createContext, useState, useEffect, useContext } from 'react';

const defaultCustomer = { name: "Ma'mirjon", tableNumber: 7 };
export const MealsContext = createContext();

export const MealsProvider = ({ children }) => {
  const [addedMeals, setAddedMeals] = useState(() => {
    try {
      const data = localStorage.getItem('addedMeals');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [customerData, setCustomerData] = useState(() => {
    try {
      const data = localStorage.getItem('customerData');
      return data ? JSON.parse(data) : defaultCustomer;
    } catch {
      return defaultCustomer;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('addedMeals', JSON.stringify(addedMeals));
    } catch (e) {
      console.warn('Error saving meals:', e);
    }
  }, [addedMeals]);

  useEffect(() => {
    try {
      localStorage.setItem('customerData', JSON.stringify(customerData));
    } catch (e) {
      console.warn('Error saving customer data:', e);
    }
  }, [customerData]);

  const addMeal = (meal) => {
    setAddedMeals((prev) => {
      const existing = prev.find((m) => m.id === meal.id);
      if (existing) {
        return prev.map((m) =>
          m.id === meal.id ? { ...m, quantity: m.quantity + 1 } : m
        );
      }
      return [...prev, { ...meal, quantity: meal.quantity || 1 }];
    });
  };

  const removeMeal = (mealId) => {
    setAddedMeals((prev) => {
      const existing = prev.find((m) => m.id === mealId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((m) =>
          m.id === mealId ? { ...m, quantity: m.quantity - 1 } : m
        );
      }
      return prev.filter((m) => m.id !== mealId);
    });
  };

  const updateCustomerData = (name, tableNumber) => {
    setCustomerData({ name, tableNumber });
  };

  const clearData = ({ clearMeals = true, clearCustomer = true } = {}) => {
    if (clearMeals) {
      setAddedMeals([]);
      localStorage.removeItem('addedMeals');
    }
    if (clearCustomer) {
      setCustomerData(defaultCustomer);
      localStorage.removeItem('customerData');
    }
  };

  return (
    <MealsContext.Provider
      value={{
        addedMeals,
        addMeal,
        removeMeal,
        customerData,
        updateCustomerData,
        clearData,
      }}
    >
      {children}
    </MealsContext.Provider>
  );
};

export const useMeals = () => {
  const context = useContext(MealsContext);
  if (!context) throw new Error("useMeals must be used inside MealsProvider");
  return context;
};
