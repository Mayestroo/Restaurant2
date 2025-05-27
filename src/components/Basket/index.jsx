import React from "react";
import { useMeals } from "../../context/MealContext";
import { ShoppingCart } from "lucide-react";

const Basket = ({
  onClick,                // Callback to open modal or handle action
  showIfEmpty = false,    // Show even if no items
  className = "",         // External class override
}) => {
  const { addedMeals } = useMeals();

  const totalPrice = addedMeals.reduce(
    (sum, meal) => sum + Number(meal.price || 0) * (meal.quantity || 0),
    0
  );

  if (!showIfEmpty && totalPrice === 0) return null;

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        className="order w-auto h-[60px] p-3 bg-white rounded-full gap-2 flex flex-row justify-center items-center shadow hover:shadow-md transition"
        onClick={onClick}
      >
        <span className="order-basket w-[40px] h-[40px] bg-blue-50 rounded-full flex justify-center items-center">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
        </span>
        <p className="order-sum text-xl mx-1 font-medium">
          {totalPrice.toLocaleString()} so'm
        </p>
      </button>
    </div>
  );
};

export default Basket;
