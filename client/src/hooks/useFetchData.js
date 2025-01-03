import { useState, useEffect } from 'react';

export default function useFetchData(url, options = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = () => {
    setLoading(true);
    setError(null);

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]);

  return { data, loading, error, refetch };
}
