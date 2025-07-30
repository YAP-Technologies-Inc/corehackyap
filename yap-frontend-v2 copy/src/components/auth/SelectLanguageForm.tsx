'use client';

import { useState } from 'react';

interface SelectLanguageFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function SelectLanguageForm({ onBack, onSuccess }: SelectLanguageFormProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLanguage) return;
    
    setIsLoading(true);
    
    // Simulate saving language selection
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="text-blue-600 mb-4 hover:text-blue-700"
      >
        ← Back
      </button>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Select Learning Language</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {languages.map((language) => (
            <label
              key={language.code}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedLanguage === language.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="language"
                value={language.code}
                checked={selectedLanguage === language.code}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mr-3"
              />
              <span className="text-2xl mr-3">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </label>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !selectedLanguage}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
