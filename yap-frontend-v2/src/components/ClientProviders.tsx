// components/ClientProviders.tsx
'use client';

import { ReactNode } from 'react';
import RootProvider from './RootProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

// defer our real RootProvider (MetaMask + UserContext + ClientWrapper)
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <RootProvider>{children}</RootProvider>
    </ToastProvider>
  );
}
