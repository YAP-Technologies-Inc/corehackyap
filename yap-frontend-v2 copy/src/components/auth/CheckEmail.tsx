'use client';

import { useRouter } from 'next/navigation';
import Vector from '@/assets/Vector.png';
import { TablerX } from '@/icons';
import AuthLogo from '@/components/auth/AuthLogo';

interface CheckEmailProps {
  email: string;
  onBack: () => void;
}

export default function CheckEmail({ email, onBack }: CheckEmailProps) {
  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="text-blue-600 mb-4 hover:text-blue-700"
      >
        ← Back
      </button>
      
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📧</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h2>
        <p className="text-gray-600">
          We've sent a verification email to <span className="font-semibold">{email}</span>
        </p>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Please click the link in the email to complete verification</p>
        <p className="mt-2">If you don't receive the email, please check your spam folder</p>
      </div>
    </div>
  );
}
