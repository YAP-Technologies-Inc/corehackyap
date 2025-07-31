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
  switchToSepolia: () => Promise<void>;
  forceAccountSelection: () => Promise<void>;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
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

      if (provider) {
        try {
          const signer = await provider.getSigner();
          setSigner(signer);
          
          const balance = await provider.getBalance(account);
          const formattedBalance = ethers.formatEther(balance);
          setBalance(formattedBalance);
        } catch (error) {
          console.error('Error getting signer or balance:', error);
        }
      }
    }
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this app');
      return;
    }

    try {
      // First, ensure we're on the correct network (Sepolia)
      try {
        await switchToSepolia();
      } catch (networkError) {
        console.warn('Could not switch to Sepolia network:', networkError);
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

  const switchToSepolia = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask to use this app');
      return;
    }

    try {
      // Switch to Sepolia testnet (chainId: 11155111)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/5286e08a82b14a18a4964abb9283808f'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          alert('Failed to add Sepolia network to MetaMask');
        }
      } else {
        console.error('Error switching to Sepolia:', switchError);
        alert('Failed to switch to Sepolia network');
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

  const value: MetaMaskContextType = {
    account,
    balance,
    isConnected,
    provider,
    signer,
    connect,
    disconnect,
    switchToSepolia,
    forceAccountSelection,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
} 