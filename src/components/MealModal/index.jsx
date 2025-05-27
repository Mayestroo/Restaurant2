import React, { useEffect } from "react";

const MealModal = ({
  meal,
  onClose,
  addMeal,
  removeMeal,
  quantity,
  imageUrl,
  showCloseButton = true,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent scroll behind modal (optional)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle outside click to close
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-[#5D7FC1]/50 bg-opacity-50 z-50"
    >
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full relative">
        <h2 className="text-xl font-bold">{meal?.name}</h2>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={meal?.name}
            className="w-full h-40 object-cover rounded-md my-3"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md flex justify-center items-center my-3">
            <span>No Image Available</span>
          </div>
        )}

        <p className="text-gray-600">{meal?.description}</p>
        <p className="text-lg font-bold mt-2">
          {meal?.price?.toLocaleString()} so'm
        </p>

        <div className="mt-4">
          {quantity === 0 ? (
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
            <div className="flex items-center justify-center bg-gray-200 rounded-md px-4 py-2">
              <button
                className="text-xl font-bold text-gray-700"
                onClick={() => removeMeal(meal?.id)}
              >
                -
              </button>
              <span className="text-lg font-medium mx-4">{quantity}</span>
              <button
                className="text-xl font-bold text-gray-700"
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

        {showCloseButton && (
          <button
            className="mt-5 w-full bg-red-600 text-white py-2 rounded-md"
            onClick={onClose}
          >
            Yopish
          </button>
        )}
      </div>
    </div>
  );
};

export default MealModal;
