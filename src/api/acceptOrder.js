const handleAcceptOrder = async (
  orderId,
  token,
  setShowModal,
  setError,
  fetchOrders
) => {
  try {
    const response = await fetch(
      `http://localhost:5063/api/Order/WaitorAcceptOrder?orderId=${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Buyurtma qabul qilishda xatolik: ${response.status} - ${
          errorText || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log(" Buyurtma qabul qilindi:", data);

    setShowModal(false);
    fetchOrders(); // Refresh orders
  } catch (error) {
    console.error("Buyurtma qabul qilishda xatolik:", error);
    setError("Buyurtma qabul qilishda xatolik: " + error.message);
  }
};

export { handleAcceptOrder };
