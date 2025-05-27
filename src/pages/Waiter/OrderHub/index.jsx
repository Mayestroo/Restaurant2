import { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/getAllOrders";
import OrderModal from "./OrderModal";
import connection from "../../../api/signalR/connection.js";
import { Loader2, FileText } from "lucide-react"; // for spinner & empty icon

const TAKE = 10;

const OrderHub = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch orders with pagination
  const fetchOrders = async (skip = 0) => {
    setLoading(true);
    try {
      const { orders, total } = await getAllOrders({ skip, take: TAKE });
      setOrders(orders);
      setTotalCount(total);
      setError(null);
    } catch (err) {
      setError(err.message || "Buyurtma olishda xatolik.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and on page change
  useEffect(() => {
    fetchOrders((page - 1) * TAKE);
  }, [page]);

  // SignalR: Handle NewOrder events
  useEffect(() => {
    const handleNewOrder = () => fetchOrders((page - 1) * TAKE);
    connection.off("NewOrder");
    connection.on("NewOrder", handleNewOrder);
    return () => {
      connection.off("NewOrder", handleNewOrder);
    };
  }, [page]);

  // SignalR: Handle RemoveOrder events
  useEffect(() => {
    const handleRemoveOrder = () => fetchOrders((page - 1) * TAKE);
    connection.off("RemoveOrder");
    connection.on("RemoveOrder", handleRemoveOrder);
    return () => {
      connection.off("RemoveOrder", handleRemoveOrder);
    };
  }, [page]);

  // SignalR connection (safety)
  useEffect(() => {
    if (connection && connection.state === "Disconnected") {
      connection.start().catch(() => {});
    }
  }, []);

  const totalPages = Math.ceil(totalCount / TAKE);

  const getStatusColor = (status) => {
    if (status === "Faol") return "text-green-600 bg-green-100";
    if (status === "Tugatilgan") return "text-red-600 bg-red-100";
    return "text-gray-500 bg-gray-100";
  };

  return (
    <div className="flex min-h-[80vh] bg-[#F4F6FA]">
      {/* Sidebar */}
      <aside className="w-72 p-6 border-r bg-white rounded-r-2xl shadow-md flex flex-col gap-4">
        <div>
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl font-semibold text-blue-700 shadow-sm">
                Buyurtmalar navbati
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-600 transition">
                Stollar
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-600 transition">
                Buyurtmalar tarixi
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Orders List */}
      <main className="flex-1 py-8 px-8 flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Faol buyurtmalar</h1>
            <p className="text-gray-500">Restoran bo'yicha yangi va faol buyurtmalar ro'yxati</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
            {totalCount} ta buyurtma
          </span>
        </header>

        {error && (
          <div className="mb-4 text-center text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
        )}

        <div className="relative flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-72">
              <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
              <span className="mt-3 text-blue-500 font-semibold">Yuklanmoqda...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72">
              <FileText className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-lg text-gray-400">Hozircha buyurtmalar yo‘q</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="cursor-pointer rounded-xl bg-white shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all flex flex-col justify-between"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Buyurtma raqami: <span className="font-semibold">{order.orderNumber}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Stol raqami: <span className="font-semibold">{order.tableId}</span>
                    </p>
                    <p className="text-xs text-gray-400">{order.orderedTime}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      {order.totalPrice?.toLocaleString()} so'm
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                        order.status
                      )} border`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center gap-1 mt-8">
            <button
              className="px-4 py-2 rounded-lg bg-white border shadow hover:bg-blue-50 disabled:opacity-60"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              &larr;
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-lg border shadow transition ${
                  page === idx + 1
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-white hover:bg-blue-50 text-gray-700"
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-lg bg-white border shadow hover:bg-blue-50 disabled:opacity-60"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              &rarr;
            </button>
          </nav>
        )}
      </main>

      {/* Modal for order details */}
      <OrderModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default OrderHub;
