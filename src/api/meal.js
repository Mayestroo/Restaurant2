export default async function getMeal(
  token,
  setDatas,
  setError,
  categoryId,
  name
) {
  try {
    const url = "http://localhost:5050/api/Meal/Meals";
    const requestBody = {
      name: name,
      categoryId: categoryId,
      skip: 0,
      take: 10,
      model: {},
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setDatas(data?.result?.data);
  } catch (error) {
    // console.error("Error fetching meals:", error);
    setError("Failed to fetch meals. Please try again.");
  }
}
