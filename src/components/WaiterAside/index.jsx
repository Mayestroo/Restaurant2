import React, { useState } from "react";
import { useWaiterMeals } from "../../context/WaiterMealContext";
import line from "../../assets/line.svg";
import { AddOrder } from "../../api/order";

const WaiterAside = ({ showModal, setShowModal }) => {
  const { addedMeals, setAddedMeals } = useWaiterMeals();
  const [error, setError] = useState(null);
  const [datas, setDatas] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showModal) return null;

  const token = localStorage.getItem("access_token");

  const totalAmount = addedMeals.reduce(
    (sum, meal) => sum + Number(meal.price || 0) * (meal.quantity || 0),
    0
  );

  const serviceFee = 0;
  const grandTotal = totalAmount + serviceFee;

  // Clear basket after order
  const clearData = () => setAddedMeals([]);

  const sendOrderToBackend = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const orderData = {
        number: `#${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        tableId: 1,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Faol",
        price: grandTotal.toLocaleString(),
        items: addedMeals.map((meal) => ({
          menuItemId: meal.id,
          name: meal.name,
          price: Number(meal.price || 0),
          quantity: meal.quantity || 0,
          total: Number(meal.price || 0) * (meal.quantity || 0),
        })),
        totalAmount,
        client: { tableNumber: 1 },
      };

      await AddOrder(token, orderData, setDatas, setError, clearData);
      setShowModal(false);
    } catch (err) {
      setError("Buyurtma yuborishda xatolik: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] bg-[#5D7FC1]/50 bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <button
          className="absolute top-3 right-4 text-xl text-gray-600 hover:text-red-500"
          onClick={() => setShowModal(false)}
          aria-label="Close"
        >
          <i className="fa-solid fa-x"></i>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Savatcha</h2>

        <div className="order-list space-y-3 text-gray-700 max-h-[300px] overflow-y-auto pr-1">
          {addedMeals.length > 0 ? (
            addedMeals.map((meal, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-lg">{meal.name}</p>
                  <p className="text-sm text-gray-500">
                    {meal.quantity} x {Number(meal.price).toLocaleString()} so'm
                  </p>
                </div>
                <p className="font-medium text-lg">
                  {(meal.price * meal.quantity).toLocaleString()} so'm
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              <p>Hozircha hech narsa yo‘q</p>
              <img src={line} alt="empty" className="mx-auto mt-2 w-10" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center border-t pt-3 mt-4">
          <span className="text-gray-700">Servis narxi:</span>
          <span>{serviceFee.toLocaleString()} so'm</span>
        </div>

        <div className="flex justify-between items-center bg-green-400 text-white font-bold text-lg px-4 py-3 rounded-lg mt-3">
          <span>Jami:</span>
          <span>{grandTotal.toLocaleString()} so'm</span>
        </div>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}

        <button
          onClick={sendOrderToBackend}
          disabled={isSubmitting || addedMeals.length === 0}
          className={`mt-5 w-full py-3 rounded-lg text-lg font-medium transition ${
            addedMeals.length === 0 || isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? "Yuborilmoqda..." : "Buyurtma qilish"}
        </button>
      </div>
    </div>
  );
};

export default WaiterAside;
