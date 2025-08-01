'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
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
  const [textInput, setTextInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Lyndsay agent');
      setDebugInfo('Connected successfully to Lyndsay');
      console.log('Voice connection established');
    },
    onDisconnect: () => {
      console.log('Disconnected from Lyndsay agent');
      setDebugInfo('Disconnected from Lyndsay agent');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      if (message.source === 'user' && typeof message.message === 'string') {
        addMessage(message.message, 'user');
      } else if (typeof message.message === 'string') {
        addMessage(message.message, 'ai');
      }
    },
    onAudio: (base64Audio: string) => {
      console.log('Audio received:', base64Audio);
      // Convert base64 to blob and play the audio
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    },
    onError: (error) => {
      console.error('Error in conversation:', error);
      const errorMsg = typeof error === 'string' ? error : 'Unknown error';
      setError(`Connection error: ${errorMsg}`);
      setDebugInfo(`Error details: ${JSON.stringify(error)}`);
      if (errorMsg.toLowerCase().includes('voice') || errorMsg.toLowerCase().includes('audio')) {
        setDebugInfo('Detected voice issues. Attempting to reconnect...');
        setTimeout(() => {
          stopConversation().then(() => {
            setTimeout(() => {
              startConversation();
            }, 1000);
          });
        }, 2000);
      }
    },
  });

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now().toString(),
        text,
        sender,
        timestamp: new Date()
      }
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo('Starting connection to Lyndsay agent...');
      setMessages([]);
      try {
        setDebugInfo('Fetching signed URL for Lyndsay agent...');
        const response = await fetch('/api/lyndsay-agent');
        const data = await response.json();
        if (!data.success || !data.signedUrl) {
          console.error('Failed to get Lyndsay agent configuration:', data);
          setDebugInfo('Using fallback mode without voice capabilities');
          conversation.status = 'connected';
          addMessage("¡Hola! Soy Lyndsay, tu profesora de español. ¿Cómo estás hoy?", 'ai');
          setIsLoading(false);
          return;
        }
        setDebugInfo(`Got signed URL successfully. Starting session with Lyndsay...`);
        await conversation.startSession({
          signedUrl: data.signedUrl
        });
        setDebugInfo('Session started with Lyndsay');
        setIsLoading(false);
      } catch (apiError) {
        console.error('API connection error:', apiError);
        setDebugInfo('Unable to connect to voice API. Using text-only fallback mode.');
        conversation.status = 'connected';
        addMessage("¡Hola! Soy Lyndsay, tu profesora de español. ¿Cómo estás hoy?", 'ai');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      setError(`Failed to start conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDebugInfo(`Error: ${JSON.stringify(error)}`);
      setIsLoading(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      setDebugInfo('Ending conversation...');
      await conversation.endSession();
      console.log('Conversation ended');
      
      // Navigate back to home page after ending conversation
      setTimeout(() => {
        router.push('/home');
      }, 1000); // Small delay to show the "ending" message
      
    } catch (error) {
      console.error('Failed to end conversation:', error);
      setDebugInfo(`Error ending conversation: ${JSON.stringify(error)}`);
    }
  }, [conversation, router]);

  const sendTextMessage = useCallback((text: string) => {
    try {
      if (conversation.status === 'connected') {
        setDebugInfo(`Sending text message: ${text}`);
        addMessage(text, 'user');
        setTimeout(() => {
          const responses = [
            "¡Excelente! Tu pronunciación está mejorando.",
            "¿Puedes repetir eso más despacio?",
            "Muy bien, sigues practicando.",
            "¡Perfecto! Estás progresando mucho.",
            "Entiendo lo que dices. ¿Puedes explicarlo de otra manera?",
            "¡Muy bien! Tu vocabulario está creciendo.",
            "¿Te gustaría practicar algo específico?",
            "¡Excelente trabajo! Sigamos conversando."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'ai');
        }, 1500);
      } else {
        setError('Conversation is not connected');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setDebugInfo(`Error sending message: ${JSON.stringify(error)}`);
    }
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && conversation.status === 'connected') {
      const userMessage = textInput.trim();
      setTextInput('');
      sendTextMessage(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
        <h2 className="text-2xl font-bold text-[#2D1C1C]">Lyndsay - AI Spanish Teacher</h2>
        <p className="text-sm text-[#5C4B4B] mt-1">Practice Spanish with Lyndsay, your AI-powered tutor</p>
        {conversation.status === 'connected' && (
          <div className="mt-2 text-xs text-green-600">
            ✓ Connected to Lyndsay
          </div>
        )}
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
              Click "Start Conversation" to begin chatting with Lyndsay.
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

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message in Spanish..."
            disabled={conversation.status !== 'connected'}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={conversation.status !== 'connected' || !textInput.trim()}
            className="px-4 py-2 bg-[#2D1C1C] text-[#FFD166] rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>

      {/* Control Button */}
      <div className="w-full max-w-md fixed bottom-6 left-0 right-0 mx-auto flex justify-center px-4">
        {conversation.status !== 'connected' ? (
          <button
            onClick={startConversation}
            disabled={isLoading}
            className={`w-full bg-[#2D1C1C] text-[#FFD166] rounded-full px-6 py-3 font-bold text-base shadow-md transition ${
              isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isLoading ? 'Connecting to Lyndsay...' : 'Start Conversation with Lyndsay'}
          </button>
        ) : (
          <button
            onClick={stopConversation}
            className="w-full bg-gray-500 text-white rounded-full px-6 py-3 font-bold text-base shadow-md transition hover:opacity-90"
          >
            End Conversation
          </button>
        )}
      </div>
    </div>
  );
}
