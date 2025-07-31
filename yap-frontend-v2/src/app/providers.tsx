"use client";

import { MetaMaskProvider } from "@/components/wallet/MetaMaskProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MetaMaskProvider>
      {children}
    </MetaMaskProvider>
  );
}
