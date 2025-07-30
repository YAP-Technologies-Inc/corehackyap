// src/app/profile/page.tsx
'use client';

import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function ProfilePage() {
  const { account, balance: ethBalance, isConnected } = useMetaMask();
  const { balance: yapBalance } = useYAPToken();
  const { profile, isLoading } = useUserProfile();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
          <p className="text-gray-600">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
          
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">User Information</h2>
              {isLoading ? (
                <p className="text-gray-600">Loading profile...</p>
              ) : profile ? (
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {profile.name}</p>
                  <p><span className="font-medium">Language:</span> {profile.language_to_learn}</p>
                </div>
              ) : (
                <p className="text-gray-600">No profile data available</p>
              )}
            </div>

            {/* Wallet Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Wallet Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Address:</span> {account}</p>
                <p><span className="font-medium">ETH Balance:</span> {parseFloat(ethBalance).toFixed(4)} ETH</p>
                <p><span className="font-medium">YAP Balance:</span> {yapBalance} YAP</p>
              </div>
            </div>

            {/* Token Info */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <h2 className="text-xl font-semibold mb-3">Token Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">YAP Tokens:</span> {yapBalance}</p>
                <p className="text-sm opacity-90">Use YAP tokens to access AI conversation features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
