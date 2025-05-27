import React, { useState } from "react";
import { useWaiterMeals } from "../../context/WaiterMealContext";
import MealModal from "../MealModal";

const WaiterMealCard = ({ meals }) => {
  const { addedMeals, addMeal, removeMeal } = useWaiterMeals(); // ✅ Correctly using the context
  const [selectedMeal, setSelectedMeal] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {meals.map((meal) => {
        const mealInCart = addedMeals.find((m) => m?.id === meal?.id);
        const quantity = mealInCart ? mealInCart.quantity : 0;

        return (
          <div
            key={meal.id}
            className="flex flex-col p-4 bg-white shadow-lg rounded-lg hover:shadow-xl cursor-pointer"
            onClick={() => setSelectedMeal(meal)}
          >
            {meal?.imageUrl ? (
              <img
                src={meal?.imageUrl}
                alt={meal?.name}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex justify-center items-center">
                <span>No Image Available</span>
              </div>
            )}

            <div className="mt-4">
              <p className="text-lg font-semibold">{meal?.name}</p>
              <p className="text-gray-600 text-sm">{meal?.description}</p>
              <p className="text-xl font-bold mt-2">
                {meal?.price?.toLocaleString()} so'm
              </p>

              <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                {quantity === 0 ? (
                  <button
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() =>
                      addMeal({
                        id: meal?.id,
                        name: meal?.name,
                        price: meal?.price,
                        quantity: 1,
                      })
                    }
                  >
                    Qo'shish
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-gray-200 rounded-md px-4 py-2">
                    <button
                      className="text-xl font-bold"
                      onClick={() => removeMeal(meal?.id)}
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      className="text-xl font-bold"
                      onClick={() =>
                        addMeal({
                          id: meal?.id,
                          name: meal?.name,
                          price: meal?.price,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {selectedMeal && (
        <MealModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          addMeal={addMeal}
          removeMeal={removeMeal}
          quantity={
            addedMeals.find((m) => m?.id === selectedMeal?.id)?.quantity || 0
          }
          imageUrl={selectedMeal?.imageUrl}
        />
      )}
    </div>
  );
};

export default WaiterMealCard;
