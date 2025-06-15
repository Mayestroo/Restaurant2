import { useState } from "react";

export const useCurrentOrders = ({ skip = 0, take = 10 } = {}) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const url = `http://localhost:5050/api/Order/CurrentWaitorOrders?skip=${skip}&take=${take}`;

  const parseOrderNumber = (orderNumber) =>
    parseInt(orderNumber.replace(/\D/g, ""), 10) || 0;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Serverdan xatolik.");
      const data = await response.json();
      const orders = data?.result?.data || [];
      console.log("Fetched current orders:", orders.length);
      const sorted = orders
        .slice()
        .sort((a, b) => parseOrderNumber(b.orderNumber) - parseOrderNumber(a.orderNumber));
      setCurrentOrders(sorted);
      setError(null);
    } catch (err) {
      setError(err.message || "Buyurtma olishda xatolik.");
      setCurrentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return { currentOrders, loading, error, fetchOrders };
};