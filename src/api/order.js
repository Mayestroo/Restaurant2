import { toast } from 'react-toastify';

export async function AddOrder(token, orderData, setDatas, setError, clearData) {
  try {
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const response = await fetch('http://localhost:5063/api/Order/AddOrder', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${errorText || 'Unknown error'}`
      );
    }

    const data = await response.json();
    console.log('API Response:', data);

    const resultData = data.result?.data || data.data || data;
    setError(null);
    setDatas(resultData);

    toast.success('Buyurtma muvaffaqiyatli jo‘natildi!');

    localStorage.removeItem('addedMeals');
    localStorage.removeItem('customerData');

    if (typeof clearData === 'function') {
      clearData();
    }
  } catch (error) {
    console.error('Error adding order:', error);
    setError(`Buyurtma yuborilmadi: ${error.message}`);
    toast.error(`Buyurtma yuborilmadi: ${error.message}`);
  }
}
