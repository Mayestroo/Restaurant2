import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import OrderModal from "../OrderModal";
import { useSignalR } from "../../../../hooks/useSignalR";
import { HubConnectionState } from "@microsoft/signalr";
import { useCurrentOrders } from "../../../../api/useCurrentOrders.js";
import { jwtDecode } from "jwt-decode";

const CurrentOrders = () => {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const connectionRef = useSignalR();
  const { currentOrders, loading, error, fetchOrders } = useCurrentOrders();

  const totalCount = currentOrders.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pagedOrders = currentOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const connection = connectionRef.current;
    const handleReload = () => fetchOrders();

    if (connection?.state === HubConnectionState.Connected) {
      connection.off("NewOrder");
      connection.on("NewOrder", handleReload);
      connection.off("RemoveOrder");
      connection.on("RemoveOrder", handleReload);
    }

    return () => {
      if (connection) {
        connection.off("NewOrder", handleReload);
        connection.off("RemoveOrder", handleReload);
      }
    };
  }, [connectionRef]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const token = localStorage.getItem("access_token");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch {
    decoded = null;
  }

  return (
    <div className="current-orders w-[70vw] ml-[300px] py-8 px-8 flex flex-col mt-16 bg-[#F4F6FA] ">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Joriy buyurtmalar</h1>
          <p className="text-gray-500">Restoran bo'yicha joriy buyurtmalar ro'yxati</p>
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
            <span className="mt-3 text-blue-500 font-semibold">Yuklanmoqda...</span>
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
                    <p>
                      Buyurtma raqami:{" "}
                      <span className="font-semibold">{order.orderNumber}</span>
                    </p>
                    <p>
                      Stol raqami:{" "}
                      <span className="font-semibold">{order.tableId}</span>
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {dayjs(order.orderedTime).format("HH:mm; DD.MM.YYYY")}
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-xl font-semibold text-gray-800">
                    {order.totalPrice?.toLocaleString()} so'm
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-1 mt-12">
          <button
            className="px-4 py-2 rounded-lg bg-white border shadow hover:bg-blue-50 disabled:opacity-60"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg border shadow transition ${page === idx + 1
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
            →
          </button>
        </nav>
      )}

      <OrderModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedOrder={selectedOrder}
        fetchOrders={fetchOrders}
        setError={() => { }}
        token={token}
        userRole={decoded?.roleId}
      />
    </div>
  );
};

export default CurrentOrders;
