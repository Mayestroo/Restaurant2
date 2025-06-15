import  { useState } from "react";
import { updateOrderStatus } from "../../../../api/updateOrderStatus"; 

const statuses = [
  { label: "Qabul qilish", value: 2 },
  { label: "Tayyor", value: 3 },
  { label: "Ofitsiantga topshirish", value: 4 },
];

const OrderStatuModal = ({ order, onClose, onStatusUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus({ id: order.id, status: newStatus });
      onStatusUpdated(); 
      onClose();
    } catch (error) {
      console.error("Status o'zgarishda xatolik:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black"
        >
          &#10005;
        </button>

        <h2 className="text-xl font-semibold mb-4">Buyurtma holati</h2>
        <p className="text-gray-700 mb-4">
          Buyurtma holatini o'zgartirish uchun quyidagi variantlardan birini tanlang:
        </p>

        <div className="flex flex-col space-y-3">
          {statuses.map((s) => (
            <button
              key={s.value}
              className={`py-2 px-4 rounded text-white transition ${
                  s.value === 2
                  ? "bg-blue-500 hover:bg-blue-600"
                  : s.value === 3
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => handleStatusChange(s.value)}
              disabled={loading}
            >
              {loading ? "Yuklanmoqda..." : s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatuModal;
