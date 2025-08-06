'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface MetaMaskContextType {
  account: string | null;
  balance: string;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToCoreTestnet: () => Promise<void>;
  forceAccountSelection: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) {
    // Return a default context instead of throwing an error
    return {
      account: null,
      balance: '0',
      isConnected: false,
      provider: null,
      signer: null,
      connect: async () => {},
      disconnect: () => {},
      switchToCoreTestnet: async () => {},
      forceAccountSelection: async () => {},
      refreshBalance: async () => {},
    };
  }
  return context;
}

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

export function MetaMaskProvider({ children }: MetaMaskProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize provider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    }
  }, []);

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await handleAccountsChanged(accounts);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Refresh balance when provider and account are ready
  useEffect(() => {
    if (provider && account && isConnected) {
      const refreshBalanceOnLoad = async () => {
        try {
          const balance = await provider.getBalance(account);
          const formattedBalance = ethers.formatEther(balance);
          setBalance(formattedBalance);
          console.log('✅ Balance refreshed on provider ready:', formattedBalance);
        } catch (error) {
          console.error('Error refreshing balance on load:', error);
        }
      };
      
      // Add a small delay to ensure provider is fully ready
      setTimeout(refreshBalanceOnLoad, 200);
    }
  }, [provider, account, isConnected]);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance('0');
      setIsConnected(false);
      setSigner(null);
    } else {
      const account = accounts[0];
      setAccount(account);
      setIsConnected(true);

      // Wait a bit for provider to be ready, then get balance
      setTimeout(async () => {
        if (provider) {
          try {
            const signer = await provider.getSigner();
            setSigner(signer);
            
            const balance = await provider.getBalance(account);
            const formattedBalance = ethers.formatEther(balance);
            setBalance(formattedBalance);
            console.log('✅ Balance loaded on account change:', formattedBalance);
          } catch (error) {
            console.error('Error getting signer or balance:', error);
          }
        }
      }, 100);
    }
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this app');
      return;
    }

    try {
      // First, ensure we're on the correct network (Core Testnet2)
      try {
        await switchToCoreTestnet();
      } catch (networkError) {
        console.warn('Could not switch to Core Testnet2 network:', networkError);
        // Continue anyway, user can manually switch
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      await handleAccountsChanged(accounts);
    } catch (error: any) {
      if (error.code === 4001) {
        alert('Please connect your MetaMask wallet');
      } else {
        console.error('Error connecting to MetaMask:', error);
        alert('Error connecting to MetaMask');
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance('0');
    setIsConnected(false);
    setSigner(null);
  };

  const switchToCoreTestnet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this app');
      return;
    }

    try {
      // Switch to Core testnet2 (chainId: 1114)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x45A' }], // Core testnet2
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x45A',
                chainName: 'Core Blockchain Testnet2',
                nativeCurrency: {
                  name: 'CORE',
                  symbol: 'CORE',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.test2.btcs.network'],
                blockExplorerUrls: ['https://scan.test2.btcs.network'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Core testnet2 network:', addError);
          alert('Failed to add Core testnet2 network to MetaMask');
        }
      } else {
        console.error('Error switching to Core testnet2:', switchError);
        alert('Failed to switch to Core testnet2 network');
      }
    }
  };

  const forceAccountSelection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this app');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      await handleAccountsChanged(accounts);
    } catch (error: any) {
      if (error.code === 4001) {
        alert('Please connect your MetaMask wallet');
      } else {
        console.error('Error forcing account selection:', error);
        alert('Error forcing account selection');
      }
    }
  };

  const refreshBalance = async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account);
        const formattedBalance = ethers.formatEther(balance);
        setBalance(formattedBalance);
        console.log('✅ CORE balance refreshed:', formattedBalance);
      } catch (error) {
        console.error('Error refreshing CORE balance:', error);
      }
    }
  };

  const value: MetaMaskContextType = {
    account,
    balance,
    isConnected,
    provider,
    signer,
    connect,
    disconnect,
    switchToCoreTestnet,
    forceAccountSelection,
    refreshBalance,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
} 