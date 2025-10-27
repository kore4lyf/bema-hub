import { useEffect, useState } from 'react';

export const useAuthData = () => {
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('authData');
    if (data) {
      try {
        setAuthData(JSON.parse(data));
      } catch {
        setAuthData(null);
      }
    }
  }, []);

  return authData;
};
