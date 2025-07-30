'use client';

import { useState, useEffect } from 'react';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';

export function useUserProfile() {
  const [name, setName] = useState('User');
  const [language, setLanguage] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const { account, isConnected } = useMetaMask();

  useEffect(() => {
    if (!isConnected || !account) {
      setName('User');
      setLanguage('Spanish');
      return;
    }

    setIsLoading(true);
    
    // Generate user ID from wallet address
    const userId = account.slice(2, 10).toLowerCase();
    
    // Fetch user profile from backend
    fetch(`/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setName(data.name);
        }
        if (data.language_to_learn) {
          setLanguage(data.language_to_learn);
        }
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
        // Fallback to wallet-based name
        setName(`Wallet User (${account.slice(0, 6)}...${account.slice(-4)})`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isConnected, account]);

  return {
    name,
    language,
    isLoading,
  };
}
