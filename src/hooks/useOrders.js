// src/hooks/useOrders.js
import { useState } from "react";
import { getAllOrders } from "../api/getAllOrders";

export const useOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseOrderNumber = (orderNumber) =>
    parseInt(orderNumber.replace(/\D/g, ""), 10) || 0;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders } = await getAllOrders({ skip: 0, take: 1000 });
      const sorted = orders
        .slice()
        .sort((a, b) => parseOrderNumber(b.orderNumber) - parseOrderNumber(a.orderNumber));
      setAllOrders(sorted);
      setError(null);
    } catch (err) {
      setError(err.message || "Buyurtma olishda xatolik.");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return { allOrders, loading, error, fetchOrders };
};
