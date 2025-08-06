'use client';

import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';
import { useEffect } from 'react';

export default function BalanceCard() {
  const { balance: yapBalance, getBalance, isLoading } = useYAPToken();

  // Auto-refresh balance when component mounts
  useEffect(() => {
    getBalance();
  }, []);

  const handleRefresh = async () => {
    console.log('🔄 Refreshing YAP balance...');
    try {
      // Force a fresh balance fetch
      await getBalance();
      console.log('✅ Balance refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing balance:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Available Balance</h3>
          <div className="mt-2 space-y-1">
            <p className="text-3xl font-bold text-white">
              {isLoading ? '...' : yapBalance} YAP
            </p>
            <p className="text-sm text-indigo-100">Token Balance</p>
          </div>
        </div>

      </div>
      
      {/* Refresh Button - Better Design */}
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="mt-4 w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 border border-white border-opacity-30 flex items-center justify-center gap-2"
      >
        <svg 
          className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        {isLoading ? 'Refreshing...' : 'Refresh Balance'}
      </button>
    </div>
  );
}
