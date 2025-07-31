'use client';

import { useEffect } from 'react';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';

export function useInitializeUser() {
  const { account, isConnected } = useMetaMask();

  useEffect(() => {
    if (isConnected && account) {
      // Set user ID based on MetaMask account address
      const userId = account.slice(2, 10).toLowerCase();
      localStorage.setItem('userId', userId);
      console.log('User initialized with wallet address:', account);
    }
  }, [isConnected, account]);
}
