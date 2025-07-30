// components/RootProvider.tsx
'use client';

import { MetaMaskProvider } from './wallet/MetaMaskProvider';
import ClientWrapper from './ClientWrapper';
import { UserProvider } from '@/context/UserContext';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MetaMaskProvider>
      <UserProvider>
        <ClientWrapper>{children}</ClientWrapper>
      </UserProvider>
    </MetaMaskProvider>
  );
}
