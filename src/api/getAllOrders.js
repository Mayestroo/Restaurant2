// api/getAllOrders.js
export const getAllOrders = async ({ skip = 0, take = 10 } = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(
      `http://localhost:5063/api/Order/ActiveOrders?skip=${skip}&take=${take}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();
    // API returns: { statusCode, result: { total_counts, data }, ... }
    return {
      orders: data.result?.data || [],
      total: data.result?.total_counts || 0,
    };
  } catch (error) {
    console.error("Error loading orders:", error);
    throw error;
  }
};
