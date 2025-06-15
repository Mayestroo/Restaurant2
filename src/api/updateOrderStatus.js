const token = localStorage.getItem("access_token");

export const updateOrderStatus = async ({ id, status }) => {
  const response = await fetch(`http://localhost:5050/api/Order/UpdateOrderDetailStatus?orderDetailId=${id}&status=${status}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("Buyurtma holatini o'zgartirishda xatolik yuz berdi");
  }

  return response.json();
};
