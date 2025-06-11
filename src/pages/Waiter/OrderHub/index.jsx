import { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/getAllOrders";
import connection from "../../../api/signalR/connection.js";
import { jwtDecode } from "jwt-decode";
import { Link, Outlet } from "react-router-dom";

const OrderHub = () => {

  const token = localStorage.getItem("access_token");
  let decoded = null;
  try {
    decoded = token ? jwtDecode(token) : null;
  } catch (e) {
    decoded = null;
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders: fetchedOrders } = await getAllOrders({
        skip: 0,
        take: 1000,
      });
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
        <Link to='/waiter/orders/activeorders' className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl font-semibold text-blue-700 shadow-sm">
          Buyurtmalar navbati
        </Link>
        <Link to='/waiter/orders/closedorders' className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-600 transition">
          Stollar
        </Link>
        <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-600 transition">
          Buyurtmalar tarixi
        </button>
      </aside>

      <Outlet />
    </div>
  );
};

export default OrderHub;
