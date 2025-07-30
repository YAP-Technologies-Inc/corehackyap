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

  const handleLearn = () => {
    if (!isLearned) {
      onLearned();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          {word.spanish}
        </h2>
        
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
  