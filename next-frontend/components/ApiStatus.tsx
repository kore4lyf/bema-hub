'use client';

import { useState, useEffect } from 'react';

interface ApiStatusProps {
  baseUrl: string;
}

export default function ApiStatus({ baseUrl }: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${baseUrl}/wp-json/bema-hub/v1/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test' })
      });
      
      // Even if the token is invalid, if we get a response, the API is online
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [baseUrl]);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'checking': return '🟡';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      <span className="mr-2">{getStatusIcon()}</span>
      <span className="capitalize">{status}</span>
      {lastCheck && (
        <span className="ml-2 text-xs opacity-75">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
