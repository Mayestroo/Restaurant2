import { useState, useCallback } from 'react';

export function useMealFetcher() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMeals = useCallback(async (token, categoryId, name) => {
    setLoading(true);
    setError(null);
    try {
      const url = 'http://localhost:5050/api/Meal/Meals';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          categoryId,
          skip: 0,
          take: 10,
          model: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result?.result?.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch meals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, fetchMeals };
}
