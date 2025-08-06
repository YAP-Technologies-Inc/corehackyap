'use client';

import { useRouter } from 'next/navigation';
import { useMetaMask } from './MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';

export default function WalletConnect() {
  const router = useRouter();
  const { account, balance, isConnected, connect, disconnect } = useMetaMask();
  const { balance: yapBalance } = useYAPToken();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleLogout = () => {
    // Clear all user data and cache
    localStorage.clear();
    sessionStorage.clear();
    
    // Disconnect wallet
    disconnect();
    
    // Redirect to auth page
    router.push('/auth');
  };



  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Connected Wallet</h3>
          <p className="text-sm text-gray-600">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
          <p className="text-sm text-gray-600">
            CORE Balance: {parseFloat(balance).toFixed(4)} TCORE2
          </p>
          <p className="text-sm text-gray-600">
            YAP Balance: {yapBalance} YAP
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDisconnect}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
          >
            Disconnect
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 