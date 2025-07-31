'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function SpanishTeacherConversation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender, timestamp: new Date() },
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo('Starting Spanish Teacher session...');
    setMessages([]);

    try {
      // Add a welcome message
      addMessage('¡Hola! Soy tu profesor de español. ¿Cómo estás hoy?', 'ai');
      setDebugInfo('Session started successfully!');
    } catch (error: any) {
      setError('Failed to start: ' + (error?.message || 'Unknown error'));
    }

    setIsLoading(false);
  }, []);

  const stopConversation = useCallback(async () => {
    setDebugInfo('Ending session...');
    addMessage('¡Hasta luego! Ha sido un placer ayudarte con tu español.', 'ai');
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '¡Excelente! Tu pronunciación está mejorando.',
        '¿Puedes repetir eso más despacio?',
        'Muy bien, sigues practicando.',
        '¡Perfecto! Estás progresando mucho.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'ai');
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f3ec] flex flex-col items-center py-10 px-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push('/home')}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-gray-700 text-sm font-medium"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="w-full max-w-md bg-[#fffbe6] rounded-2xl shadow-lg p-6 mb-4 text-center">
        <h2 className="text-2xl font-bold text-[#2D1C1C]">AI Spanish Teacher</h2>
        <p className="text-sm text-[#5C4B4B] mt-1">Practice Spanish with your AI-powered tutor</p>
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="text-red-500 bg-red-100 rounded-lg px-3 py-2 mb-2 text-center font-medium">
            {error}
          </div>
        )}
        {debugInfo && (
          <div className="text-gray-600 bg-gray-100 rounded-lg px-3 py-2 mb-3 text-sm">
            {debugInfo}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1 mb-2 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center mt-8 text-gray-600 font-medium">
              Press "Start Conversation" to begin.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${
                    msg.sender === 'user' ? 'bg-[#FFD166]' : 'bg-[#f1ece6]'
                  } text-[#2D1C1C] rounded-xl px-4 py-2 max-w-[80%] text-base shadow-sm`}
                >
                  <div className="mb-1">{msg.text}</div>
                  <div className="text-xs text-gray-500 text-right">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Control Button */}
      <div className="w-full max-w-md fixed bottom-6 left-0 right-0 mx-auto flex justify-center px-4">
        <button
          onClick={startConversation}
          disabled={isLoading}
          className={`w-full bg-[#2D1C1C] text-[#FFD166] rounded-full px-6 py-3 font-bold text-base shadow-md transition ${
            isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isLoading ? 'Connecting...' : 'Start Conversation'}
        </button>
      </div>
    </div>
  );
}
