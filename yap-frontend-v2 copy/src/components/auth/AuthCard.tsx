'use client';

import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
}
