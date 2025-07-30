'use client';

import { useState, useEffect } from 'react';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';

export function useUserStats() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [totalYapEarned, setTotalYapEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { account, isConnected } = useMetaMask();

  useEffect(() => {
    if (!isConnected || !account) {
      setCurrentStreak(0);
      setHighestStreak(0);
      setTotalYapEarned(0);
      return;
    }

    setIsLoading(true);
    
    // Generate user ID from wallet address
    const userId = account.slice(2, 10).toLowerCase();
    
    // Fetch user stats from backend
    fetch(`/api/user-stats/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCurrentStreak(data.current_streak || 0);
        setHighestStreak(data.highest_streak || 0);
        setTotalYapEarned(data.total_yap_earned || 0);
      })
      .catch(err => {
        console.error('Error fetching user stats:', err);
        // Keep default values on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isConnected, account]);

  return {
    currentStreak,
    highestStreak,
    totalYapEarned,
    isLoading,
  };
}
