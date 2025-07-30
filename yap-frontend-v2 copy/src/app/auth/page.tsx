'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import AuthCard from '@/components/auth/AuthCard';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginForm from '@/components/auth/LoginForm';
import SelectLanguageForm from '@/components/auth/SelectLanguageForm';
import CheckEmail from '@/components/auth/CheckEmail';
import AuthLogo from '@/components/auth/AuthLogo';
import AuthButtons from '@/components/auth/AuthButtons';

type AuthStep = 'welcome' | 'login' | 'signup' | 'language' | 'check-email';

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { isConnected } = useMetaMask();

  useEffect(() => {
    if (isConnected) {
      router.push('/home');
    }
  }, [isConnected, router]);

  const handleStepChange = (newStep: AuthStep) => {
    setStep(newStep);
  };

  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    setStep('check-email');
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4">
      <AuthCard>
        <AuthLogo />
        
        {step === 'welcome' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              Welcome to YAP
            </h1>
            <p className="text-sm text-secondary mb-6">
              The only app that pays you to learn languages.
            </p>
            <AuthButtons onStepChange={handleStepChange} />
          </div>
        )}

        {step === 'login' && (
          <LoginForm 
            onBack={() => setStep('welcome')}
            onSuccess={() => router.push('/home')}
          />
        )}

        {step === 'signup' && (
          <SignUpForm 
            onBack={() => setStep('welcome')}
            onSuccess={() => setStep('language')}
          />
        )}

        {step === 'language' && (
          <SelectLanguageForm 
            onBack={() => setStep('signup')}
            onSuccess={() => router.push('/home')}
          />
        )}

        {step === 'check-email' && (
          <CheckEmail 
            email={email}
            onBack={() => setStep('welcome')}
          />
        )}
      </AuthCard>
    </div>
  );
}
