'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMetaMask } from '@/components/wallet/MetaMaskProvider';
import { useToast } from '@/components/ui/ToastProvider';
import WordCard from './WordCard';
import LearnedWordGrid from './LearnedWordGrid';

interface LessonUiProps {
  lessonId: string;
  onComplete?: () => void;
  isCompleting?: boolean;
}

export default function LessonUi({ lessonId, onComplete, isCompleting }: LessonUiProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const { isConnected } = useMetaMask();
  const [currentStep, setCurrentStep] = useState(0);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  // Mock lesson data
  const lessonData = {
    title: `Lesson ${lessonId}`,
    words: [
      { spanish: 'hola', english: 'hello', example: '¡Hola! ¿Cómo estás?' },
      { spanish: 'gracias', english: 'thank you', example: 'Gracias por tu ayuda.' },
      { spanish: 'por favor', english: 'please', example: 'Por favor, ayúdame.' },
    ]
  };

  const handleWordLearned = (word: string) => {
    if (!learnedWords.includes(word)) {
      setLearnedWords([...learnedWords, word]);
    }
  };

  const handleComplete = () => {
    if (!isConnected) {
      pushToast('Please connect MetaMask wallet to receive token rewards', 'warning');
      return;
    }

    if (onComplete) {
      onComplete();
    } else {
      pushToast('Congratulations on completing the lesson!', 'success');
      router.push('/home');
    }
  };

  const handleNext = () => {
    if (currentStep < lessonData.words.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/home');
    }
  };

  // Add ElevenLabs audio function
  const playElevenLabsAudio = async (text: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || '2k1RrkiAltTGNFiT6rL1'
        })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('ElevenLabs API error:', response.status);
      }
    } catch (error) {
      console.error('ElevenLabs audio error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-secondary font-semibold"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-secondary">
            {lessonData.title}
          </h1>
          <div className="w-8" />
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{currentStep + 1} / {lessonData.words.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / lessonData.words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        {currentStep < lessonData.words.length ? (
          <WordCard
            word={lessonData.words[currentStep]}
            onLearned={() => handleWordLearned(lessonData.words[currentStep].spanish)}
            isLearned={learnedWords.includes(lessonData.words[currentStep].spanish)}
          />
        ) : (
          <LearnedWordGrid words={learnedWords} />
        )}
      </div>

      {/* Bottom button */}
      <div className="bg-white p-4 shadow-lg">
        <button
          onClick={handleNext}
          disabled={isCompleting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting 
            ? 'Processing...' 
            : currentStep < lessonData.words.length - 1 
              ? 'Next' 
              : 'Complete Lesson'
          }
        </button>
      </div>
    </div>
  );
}