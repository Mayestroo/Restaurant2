import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import dayjs from "dayjs";
import { chiefOrders } from "../../../api/chiefOrders";
import OrderStatuModal from "../CookerHub/OrderStatusModal/index"; 

const STATUSES = [
  { label: "Barchasi", value: "all" },
  { label: "Buyurtma qilingan", value: 1 },
  { label: "Qabul qilingan", value: 2 },
  { label: "Tayyor", value: 3 },
  { label: "Ofitsiantga topshirilgan", value: 4 },
];

const CookerHub = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  const fetchOrders = async (status) => {
    try {
      const statusValue = status === "all" ? undefined : status;
      const data = await chiefOrders({ skip: 0, take: 10, status: statusValue });
      setOrders(data.result.data || []);
      setCounts(data.result.total_counts || null);
    } catch (error) {
      console.error("Buyurtmalarni olishda xatolik:", error);
    }
  };

  return (
    <div className="flex min-h-[80vh] bg-[#F4F6FA] mt-16">
      <main className="flex-1 py-8 px-8 flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Oshpaz uchun buyurtmalar
            </h1>
            <p className="text-gray-500">
              Qabul qilingan va tayyorlash uchun oshpazga uzatilgan buyurtmalar
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            {counts} ta buyurtma
          </span>
        </header>

        {/* Status Filter */}
        <div className="flex gap-2 mt-2 mb-6 flex-wrap">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-1 rounded-full border text-sm font-medium ${
                selectedStatus === status.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="relative flex-1">
          {counts === 0 ? (
            <div className="flex flex-col items-center justify-center h-72">
              <FileText className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-lg text-gray-400">
                Hozircha bu holatda buyurtmalar yo‘q
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order) => (
                <li
                  key={order.id}
                  onClick={() => setSelectedOrder(order)} // open modal on click
                  className="flex items-center justify-between py-5 px-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-gray-800 text-[17px]">
                      {order.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Buyurtma raqami:{" "}
                      <span className="font-semibold">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p>Buyurtma miqdori -</p>
                      <span className="text-xs text-gray-500">
                        {order.quantity || 0} ta
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {dayjs(order.orderedTime).format("DD.MM.YYYY HH:mm")}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-xl font-semibold text-gray-800">
                      {order.price?.toLocaleString()} so'm
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Show modal if an order is selected */}
      {selectedOrder && (
        <OrderStatuModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default CookerHub;
