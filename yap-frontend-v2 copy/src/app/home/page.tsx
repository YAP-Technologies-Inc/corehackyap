'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useYAPToken } from '@/hooks/useYAPToken';
import { useToast } from '@/components/ui/ToastProvider';
import HeaderGreeting from '@/components/dashboard/HeaderGreeting';
import BalanceCard from '@/components/dashboard/BalanceCard';
import DailyStreak from '@/components/dashboard/DailyStreak';
import LessonCard from '@/components/dashboard/LessonCard';
import WalletConnect from '@/components/wallet/WalletConnect';
import BottomNavBar from '@/components/layout/BottomNavBar';
import TestingNoticeModal from '@/components/TestingNoticeModal';
import DailyQuizCard from '@/components/dashboard/DailyQuizPrompt';
import allLessons from '@/mock/allLessons';
import { useCompletedLessons } from '@/hooks/useCompletedLessons';
import { useUserStats } from '@/hooks/useUserStats';

export default function HomePage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { account, isConnected } = useMetaMask();
  const { consumeYAP, getBalance } = useYAPToken();
  const [lessons, setLessons] = useState<any[]>([]);
  const [checkingAccess, setCheckingAccess] = useState(false);

  // Convert allLessons object to array
  const lessonsArray = Object.values(allLessons).map((lesson: any) => ({
    lesson_id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    status: 'available'
  }));

  const {
    completedLessons,
    isLoading: isCompletedLoading,
  } = useCompletedLessons();

  const {
    currentStreak,
    highestStreak,
    totalYapEarned,
    isLoading: isStatsLoading,
  } = useUserStats();

  // Refresh balance when page loads
  useEffect(() => {
    if (isConnected && account) {
      // Force a balance refresh when returning to home page
      setTimeout(async () => {
        try {
          await getBalance();
        } catch (error) {
          console.error('Error refreshing balance:', error);
        }
      }, 1000);
    }
  }, [isConnected, account, getBalance]);

  // Update lesson completion status
  useEffect(() => {
    const computed = lessonsArray.map((lesson) => ({
      ...lesson,
      status: completedLessons.includes(lesson.lesson_id) ? 'completed' : 'available',
    }));

    // Check if the computed lessons are different from current lessons
    const hasChanged = computed.length !== lessons.length || 
      computed.some((computedLesson, index) => {
        const currentLesson = lessons[index];
        return !currentLesson || 
          computedLesson.lesson_id !== currentLesson.lesson_id ||
          computedLesson.status !== currentLesson.status;
      });

    if (hasChanged) {
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
        <div className="mt-4">
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
                id={lesson.lesson_id}
                title={lesson.title}
                description={lesson.description}
                status={lesson.status}
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
          <DailyQuizCard isUnlocked={true} />
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
