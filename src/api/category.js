export default async function getCategory(token) {
  try {
    const response = await fetch('http://localhost:5063/api/CategoryControlller/AllCategories', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return { data: data?.result?.data || [], error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [], error: 'Kategoriya maʼlumotlarini olishda xatolik yuz berdi.' };
  }
}
