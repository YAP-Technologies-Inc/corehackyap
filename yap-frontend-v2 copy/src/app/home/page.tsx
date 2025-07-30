'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HeaderGreeting from '@/components/dashboard/HeaderGreeting';
import BalanceCard from '@/components/dashboard/BalanceCard';
import DailyStreak from '@/components/dashboard/DailyStreak';
import BottomNavBar from '@/components/layout/BottomNavBar';
import LessonCard from '@/components/dashboard/LessonCard';
import DailyQuizCard from '@/components/dashboard/DailyQuizPrompt';
import WalletConnect from '@/components/wallet/WalletConnect';
import allLessons from '@/mock/allLessons';

import { useInitializeUser } from '@/hooks/useUserInitalizer';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserStats } from '@/hooks/useUserStats';
import { useYAPToken } from '@/hooks/useYAPToken';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import isEqual from 'lodash.isequal';
import { useToast } from '@/components/ui/ToastProvider';
import TestingNoticeModal from '@/components/TestingNoticeModal';

export default function HomePage() {
  useInitializeUser();
  const router = useRouter();
  const { pushToast } = useToast();
  const { account, isConnected } = useMetaMask();
  const { balance: yapBalance, consumeYAP } = useYAPToken();

  // Convert allLessons object to array
  const lessonsArray = Object.values(allLessons);
  const [lessons, setLessons] = useState(lessonsArray);
  const [checkingAccess, setCheckingAccess] = useState(false);

  const {
    completedLessons,
    isLoading: isLessonsLoading,
  } = useCompletedLessons();

  const {
    name,
    language,
    isLoading: isProfileLoading,
  } = useUserProfile();

  const {
    currentStreak,
    highestStreak,
    totalYapEarned,
    isLoading: isStatsLoading,
  } = useUserStats();

  // Update lesson completion status
  useEffect(() => {
    const computed = lessonsArray.map((lesson) => ({
      ...lesson,
      status: completedLessons.includes(lesson.lesson_id) ? 'completed' : 'available',
    }));

    if (!isEqual(computed, lessons)) {
      setLessons(computed);
    }
  }, [completedLessons, lessons, lessonsArray]);

  const handleSpanishTeacherAccess = async () => {
    if (!isConnected || !account) {
      pushToast('Please connect MetaMask wallet first', 'error');
      return;
    }

    setCheckingAccess(true);

    try {
      // Consume 1 YAP token
      await consumeYAP('1');
      pushToast('Successfully consumed 1 YAP token, redirecting to Spanish Teacher...', 'success');
      
      // Redirect to Spanish teacher page
      router.push('/spanish-teacher');
    } catch (err: any) {
      console.error('Access error:', err);
      pushToast(err.message || 'Could not process access request', 'error');
    } finally {
      setCheckingAccess(false);
    }
  };

  return (
    <div className="bg-background-primary min-h-screen w-full flex flex-col overflow-y-auto pb-24">
      <div className="flex-1 w-full max-w-4xl mx-auto px-4">
        <HeaderGreeting />
        
        {/* Wallet Connection */}
        <div className="mt-4 flex justify-end">
          <WalletConnect />
        </div>

        <div className="mt-2">
          <BalanceCard />
        </div>
        <div className="mt-4">
          <DailyStreak />
        </div>
        <TestingNoticeModal />
        <h3 className="text-secondary text-xl font-semibold mt-2">Lessons</h3>
        <div className="mt-2">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.lesson_id}
                lessonId={lesson.lesson_id}
                id={lesson.lesson_id}
                title={lesson.title}
                description={lesson.description}
                status={lesson.status}
                onClick={() => router.push(`/lesson/${lesson.lesson_id}`)}
              />
            ))}
          </div>
        </div>

        {/* Talk to Spanish Teacher */}
        <div className="mt-4">
          <button
            onClick={handleSpanishTeacherAccess}
            className="w-full bg-secondary hover:bg-secondary-darker text-white font-bold py-3 rounded hover:cursor-pointer transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={checkingAccess || !isConnected}
          >
            {checkingAccess
              ? 'Checking access...'
              : !isConnected
              ? 'Please connect wallet first'
              : `Talk to Spanish Teacher (Consume 1 YAP)`}
          </button>
        </div>

        {/* Daily Quiz */}
        <h3 className="text-secondary text-xl font-semibold mt-2 mb-2">
          Daily Quiz
        </h3>
        <div className="mt-2">
          <DailyQuizCard />
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
