import { useWaiterMeals } from "../../context/WaiterMealContext";
import { ShoppingCart } from "lucide-react";

const WaiterBasket = ({ onClick, showIfEmpty = false, className = "" }) => {
  const { addedMeals } = useWaiterMeals();

  const totalPrice = addedMeals.reduce(
    (sum, meal) => sum + Number(meal.price || 0) * (meal.quantity || 0),
    0
  );

  if (!showIfEmpty && totalPrice === 0) return null;

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        className="order w-auto h-auto py-2 px-2.5 bg-white rounded-full gap-2 flex flex-row justify-center items-center shadow hover:shadow-md transition"
        onClick={onClick}
      >
        <span className="order-basket w-[35px] h-[35px] bg-blue-50 rounded-full flex justify-center items-center">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
        </span>
        <p className="order-sum mx-1 font-medium">
          {totalPrice.toLocaleString()} so'm
        </p>
      </button>
    </div>
  );
};

export default WaiterBasket;
