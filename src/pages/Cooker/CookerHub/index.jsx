import { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/getAllOrders";
import { Loader2, FileText } from "lucide-react";
import dayjs from "dayjs";

function parseOrderNumber(str) {
  return Number(str.replace(/^\D+/g, ""));
}

const CookerHub = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders: allOrders } = await getAllOrders({ skip: 0, take: 1000 });
      // Filter only orders with status "Preparing"
      const filtered = allOrders.filter(
        (order) => order.status === "Preparing"
      );
      // Newest first
      filtered.sort(
        (a, b) => parseOrderNumber(b.orderNumber) - parseOrderNumber(a.orderNumber)
      );
      setOrders(filtered);
      setError(null);
    } catch (err) {
      setError(err.message || "Buyurtmalarni olishda xatolik.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-[80vh] bg-[#F4F6FA]">
      <main className="flex-1 py-8 px-8 flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Oshpaz uchun buyurtmalar
            </h1>
            <p className="text-gray-500">
              Qabul qilingan va tayyorlash uchun oshpazga uzatilgan buyurtmalar
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            {orders.length} ta buyurtma
          </span>
        </header>
        {error && (
          <div className="mb-4 text-center text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="relative flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72">
              <Loader2 className="animate-spin w-10 h-10 text-green-500" />
              <span className="mt-3 text-green-500 font-semibold">
                Yuklanmoqda...
              </span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72">
              <FileText className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-lg text-gray-400">Hozircha buyurtmalar yo‘q</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between py-5 px-6 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-gray-800 text-[17px]">
                      {order.clientName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Buyurtma raqami:{" "}
                      <span className="font-semibold">{order.orderNumber}</span>
                      &nbsp;|&nbsp;Stol raqami:{" "}
                      <span className="font-semibold">{order.tableId}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {dayjs(order.orderedTime).format("DD.MM.YYYY HH:mm")}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-xl font-semibold text-gray-800">
                      {order.totalPrice?.toLocaleString()} so'm
                    </div>
                    <span
                      className="px-4 py-1 rounded-full border text-xs font-semibold text-yellow-800 bg-yellow-100"
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default CookerHub;
