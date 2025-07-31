'use client';

interface AuthButtonsProps {
  onStepChange: (step: 'login' | 'signup') => void;
}

export default function AuthButtons({ onStepChange }: AuthButtonsProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => onStepChange('login')}
        className="w-full bg-blue-600 text-white text-2xl font-bold py-6 rounded-xl shadow hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
      <button
        onClick={() => onStepChange('signup')}
        className="w-full bg-blue-50 text-blue-600 text-2xl font-bold py-6 rounded-xl border border-blue-400 hover:bg-blue-100 transition-colors"
      >
        Sign Up
      </button>
    </div>
  );
}
