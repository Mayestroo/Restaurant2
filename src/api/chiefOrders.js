export const chiefOrders = async ({ skip = 0, take = 10, status } = {}) => {
  const token = localStorage.getItem("access_token");
  const url = new URL("http://localhost:5050/api/Order/AllOrderDetailsByChiefId");
  url.searchParams.append("skip", skip);
  url.searchParams.append("take", take);
  if (status !== undefined) {
    url.searchParams.append("status", status);
  }
  
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Serverdan xatolik.");
  return response.json();
};
