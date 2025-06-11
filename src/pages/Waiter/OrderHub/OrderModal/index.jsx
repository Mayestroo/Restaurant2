import { X } from "lucide-react";
import dayjs from "dayjs";
import { handleAcceptOrder } from '../../../../api/acceptOrder'

const OrderModal = ({ showModal,
  setShowModal,
  selectedOrder,
  token,
  setError,
  fetchOrders
}) => {

  if (!showModal || !selectedOrder) return null;
  
  const onAcceptOrder = () => {
    handleAcceptOrder(
      selectedOrder.id,
      token,
      setShowModal,
      setError,
      fetchOrders
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur"
      onClick={() => setShowModal(false)}
    >
      <div
        className="relative bg-white/70 backdrop-blur-lg rounded-xl p-8 w-[90vw] max-w-md shadow-2xl border"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 text-2xl"
          onClick={() => setShowModal(false)}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Buyurtma tafsilotlari</h2>
        <p>
          <span className="font-semibold text-gray-700">Buyurtma raqami:</span>{" "}
          {selectedOrder.orderNumber}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Stol raqami:</span>{" "}
          {selectedOrder.tableId}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Umumiy narx:</span>{" "}
          {selectedOrder.totalPrice?.toLocaleString()} so'm
        </p>
        <p>
          <span className="font-semibold text-gray-700">Vaqti:</span>{" "}
          {dayjs(selectedOrder.orderedTime).format("DD.MM.YYYY HH:mm")}
        </p>
        <div className="mt-6 flex gap-2 justify-end">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-medium"
            onClick={onAcceptOrder}
          >
            Qabul qilish
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
