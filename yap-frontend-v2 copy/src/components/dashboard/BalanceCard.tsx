'use client';

import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';

export default function BalanceCard() {
  const { balance: ethBalance } = useMetaMask();
  const { balance: yapBalance } = useYAPToken();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Available Balance</h3>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold">{yapBalance} YAP</p>
            <p className="text-sm opacity-90">Token Balance</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm opacity-90">ETH Balance</p>
            <p className="text-lg font-semibold">{parseFloat(ethBalance).toFixed(4)} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}
