import { useEffect } from "react";
import connection from "../../../api/signalR/connection.js";
import { NavLink, Outlet } from "react-router-dom";
import { useOrders } from "../../../hooks/useOrders";

const OrderHub = () => {
  const { allOrders, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
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
  }, []);

  return (
    <div className="orderhub flex flex-row justify-between">
      <aside className="w-[300px] h-[100vh] mt-[70px] fixed p-6 border-r bg-white rounded-r-2xl shadow-md flex flex-col gap-4">
        <NavLink
          to="activeorders"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-4 py-3 rounded-xl shadow-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-600"
            }`
          }
        >
          Buyurtmalar navbati
        </NavLink>

        <NavLink
          to="currentorders"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-4 py-3 rounded-xl shadow-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-600"
            }`
          }
        >
          Stollar
        </NavLink>

        <NavLink
          to="closedorders"
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-4 py-3 rounded-xl shadow-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-gray-100 text-gray-600"
            }`
          }
        >
          Buyurtmalar tarixi
        </NavLink>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </aside>

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default OrderHub;
