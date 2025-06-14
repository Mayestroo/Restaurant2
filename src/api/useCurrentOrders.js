import { useState } from "react";
import { getAllOrders } from "./getAllOrders";

export const useCurrentOrders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const url = "http://localhost:5050/api/Order/CurrentWaitorOrders";

  const parseOrderNumber = (orderNumber) =>
    parseInt(orderNumber.replace(/\D/g, ""), 10) || 0;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders } = await getAllOrders({ skip: 0, take: 1000 });
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