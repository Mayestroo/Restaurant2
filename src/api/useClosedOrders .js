import { useEffect, useState } from "react";

export const useClosedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClosedOrders = async () => {
      const token = localStorage.getItem("access_token");

    //   if (!token) {
    //     setError("Token topilmadi.");
    //     setLoading(false);
    //     return;
    //   }

      try {
        const response = await fetch(
          "http://localhost:5050/api/Order/CurrentWaitorClosedOrders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Serverdan noto‘g‘ri javob keldi.");
        }

        let data = await response.json();
        console.log(data, 'behfyg');
        
        let ordersArray = data?.result?.data || [];
        setOrders(ordersArray);
        console.log("BBBBBBB buyurtmalar:", ordersArray);
      } catch (err) {
        console.error("Buyurtmalarni yuklashda xatolik:", err);
        setError("Buyurtmalarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchClosedOrders();
  }, []);

  useEffect(() => {
    console.log("Updated orders:", orders);
  }, [orders]);

  return { orders, loading, error };
};