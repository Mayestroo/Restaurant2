import { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/getAllOrders";
import OrderModal from "./OrderModal";
import connection from "../../../api/signalR/connection.js";
import { Loader2, FileText } from "lucide-react";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const PAGE_SIZE = 10;

function parseOrderNumber(str) {
  return Number(str.replace(/^\D+/g, ""));
}
const OrderHub = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("access_token");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (e) {
    decoded = null;
  }

  // Fetch all orders once, sort, then paginate in frontend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders: fetchedOrders } = await getAllOrders({
        skip: 0,
        take: 1000,
      }); // use big take
      const sortedOrders = fetchedOrders
        .slice()
        .sort(
          (a, b) =>
            parseOrderNumber(b.orderNumber) - parseOrderNumber(a.orderNumber)
        );
      setAllOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError(err.message || "Buyurtma olishda xatolik.");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleReload = () => fetchOrders();
    connection.off("NewOrder");
    connection.on("NewOrder", handleReload);
    connection.off("RemoveOrder");
    connection.on("RemoveOrder", handleReload);
    return () => {
      connection.off("NewOrder", handleReload);
      connection.off("RemoveOrder", handleReload);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (connection && connection.state === "Disconnected") {
      connection.start().catch(() => {});
    }
  }, []);

  const totalCount = allOrders.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pagedOrders = allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            <h1 className="text-2xl font-bold text-gray-800">
              Faol buyurtmalar
            </h1>
            <p className="text-gray-500">
              Restoran bo'yicha yangi va faol buyurtmalar ro'yxati
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
            {totalCount} ta buyurtma
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
              <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
              <span className="mt-3 text-blue-500 font-semibold">
                Yuklanmoqda...
              </span>
            </div>
          ) : pagedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72">
              <FileText className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-lg text-gray-400">Hozircha buyurtmalar yo‘q</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pagedOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between py-5 px-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
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
                      className={`px-4 py-1 rounded-full border ${getStatusColor(
                        order.status
                      )} text-xs font-semibold`}
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
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

      <OrderModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedOrder={selectedOrder}
        fetchOrders={fetchOrders}
        setError={setError}
        token={token}
        userRole={decoded?.roleId}
      />
    </div>
  );
};

export default OrderHub;
