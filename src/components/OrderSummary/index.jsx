import React, { useContext } from 'react';
import line from '../../../../images/line.svg';
import { MealsContext } from '../../../MealsContext';

const OrderSummary = () => {
  const { addedMeals } = useContext(MealsContext);

  const serviceFee = 0;

  const totalMealCount = addedMeals.reduce(
    (sum, meal) => sum + (meal.quantity || 0),
    0
  );

  const totalPrice = addedMeals.reduce(
    (sum, meal) => sum + Number(meal.price || 0) * (meal.quantity || 0),
    0
  );

  const grandTotal = totalPrice + serviceFee;

  return (
    <div className="order-summary w-full h-auto p-5 flex flex-col gap-4 rounded-t-2xl bg-white shadow-sm">
      <div className="flex justify-between items-center text-base font-medium">
        <p>Ovqatlar soni ({totalMealCount} ta):</p>
        <p>{totalPrice.toLocaleString()} so'm</p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>Xizmat haqqi:</p>
        <p>{serviceFee.toLocaleString()} so'm</p>
      </div>

      <img src={line} alt="line separator" className="w-full" />

      <div className="flex justify-between items-center text-lg font-bold">
        <p>Umumiy hisob:</p>
        <p>{grandTotal.toLocaleString()} so'm</p>
      </div>
    </div>
  );
};

export default OrderSummary;
