// src/app/profile/page.tsx
'use client';

import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';
import { useUserProfile } from '@/hooks/useUserProfile';
import BottomNavBar from '@/components/layout/BottomNavBar';

export default function ProfilePage() {
  const { account, balance: ethBalance, isConnected } = useMetaMask();
  const { balance: yapBalance } = useYAPToken();
  const { profile, isLoading } = useUserProfile();

  if (!isConnected) {
    return (
      <div className="bg-bgPrimary min-h-screen w-full flex flex-col overflow-y-auto pb-24">
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
            <p className="text-gray-600">Please connect your wallet to view your profile.</p>
          </div>
        </div>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="bg-bgPrimary min-h-screen w-full flex flex-col overflow-y-auto pb-24">
      <div className="flex-1 w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
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
                <p><span className="font-medium">TCORE2 Balance:</span> {parseFloat(ethBalance).toFixed(4)} TCORE2</p>
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
      <BottomNavBar />
    </div>
  );
}
