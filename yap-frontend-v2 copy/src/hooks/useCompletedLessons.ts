'use client';

import { useState, useEffect } from 'react';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';

export function useCompletedLessons() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account, isConnected } = useMetaMask();

  useEffect(() => {
    if (!isConnected || !account) {
      setCompletedLessons([]);
      return;
    }

    setIsLoading(true);
    
    // Generate user ID from wallet address
    const userId = account.slice(2, 10).toLowerCase();
    
    // Fetch completed lessons from backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/user-lessons/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCompletedLessons(data.completedLessons || []);
      })
      .catch(err => {
        console.error('Error fetching completed lessons:', err);
        setCompletedLessons([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isConnected, account]);

  return {
    completedLessons,
    isLoading,
  };
}
