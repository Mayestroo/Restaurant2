import React from "react";
import { useMeals } from "../../context/MealContext";
import { ShoppingCart } from "lucide-react";

const Basket = ({
  onClick,               
  showIfEmpty = false,    
  className = "",         
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
        className="order w-auto p-2 bg-white rounded-full gap-2 flex flex-row justify-center items-center shadow hover:shadow-md transition"
        onClick={onClick}
      >
        <span className="order-basket w-[30px] h-[30px] bg-blue-50 rounded-full flex justify-center items-center">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
        </span>
        <p className="order-sum mx-1 font-medium">
          {totalPrice.toLocaleString()} so'm
        </p>
      </button>
    </div>
  );
};

export default Basket;
