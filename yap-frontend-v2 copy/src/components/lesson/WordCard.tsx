'use client';

import { useState } from 'react';

interface WordCardProps {
  word: {
    spanish: string;
    english: string;
    example: string;
  };
  onLearned: () => void;
  isLearned: boolean;
}

export default function WordCard({ word, onLearned, isLearned }: WordCardProps) {
  const [showEnglish, setShowEnglish] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLearn = () => {
    if (!isLearned) {
      onLearned();
    }
  };

  const playElevenLabsAudio = async (text: string) => {
    try {
      setIsPlaying(true);
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: 'spanish-voice'
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
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          {word.spanish}
        </h2>
        
        {/* Audio button */}
        <button
          onClick={() => playElevenLabsAudio(word.spanish)}
          disabled={isPlaying}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
        </button>
        
        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className="text-lg text-gray-600 mb-4 hover:text-blue-600 transition-colors"
        >
          {showEnglish ? 'Hide Translation' : 'Show Translation'}
        </button>
        
        {showEnglish && (
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {word.english}
            </p>
            <p className="text-sm text-gray-600 italic">
              "{word.example}"
            </p>
          </div>
        )}
        
        <button
          onClick={handleLearn}
          disabled={isLearned}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isLearned
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLearned ? 'Learned ✓' : 'Mark as Learned'}
        </button>
      </div>
    </div>
  );
}
  