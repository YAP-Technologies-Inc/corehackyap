'use client';

import { useState, useRef } from 'react';

interface PronunciationTestProps {
  referenceText: string;
  spanishWord: string;
}

export default function PronunciationTest({ referenceText, spanishWord }: PronunciationTestProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const recordingStartTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Request audio with maximum quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
          volume: 1.0
        } 
      });
      
      // Try different MIME types in order of preference
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
      
      console.log('Using MIME type:', mimeType);
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      const finalMimeType = mimeType; // Store for use in onstop

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType || 'audio/webm' });
        console.log('Audio blob size:', audioBlob.size, 'bytes');
        console.log('Number of audio chunks:', audioChunksRef.current.length);
        console.log('Recording duration:', Date.now() - recordingStartTimeRef.current, 'ms');
        console.log('Audio MIME type:', finalMimeType);
        
        if (audioBlob.size < 1000) {
          console.error('Audio blob too small - likely silent recording');
          alert('No audio detected. Please speak clearly when recording.');
          return;
        }
        
        // Test if we can play the audio (optional debugging)
        const audioUrl = URL.createObjectURL(audioBlob);
        const testAudio = new Audio(audioUrl);
        testAudio.onloadedmetadata = () => {
          console.log('Audio duration:', testAudio.duration, 'seconds');
        };
        testAudio.onerror = () => {
          console.error('Audio playback test failed');
        };
        
        await assessPronunciation(audioBlob);
      };

      // Start recording with a longer timeslice to ensure we get data
              mediaRecorder.start(1000); // Collect data every 1 second
        setIsRecording(true);
        recordingStartTimeRef.current = Date.now();
        
        // Add audio level monitoring
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudioLevel = () => {
          if (isRecording) {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            console.log('🎵 Audio level:', average);
            requestAnimationFrame(checkAudioLevel);
          }
        };
        checkAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const recordingDuration = Date.now() - recordingStartTimeRef.current;
      
      // Ensure minimum recording time of 2 seconds
      if (recordingDuration < 2000) {
        alert('Please record for at least 2 seconds to get an accurate assessment.');
        return;
      }
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const assessPronunciation = async (audioBlob: Blob) => {
    try {
      setIsAssessing(true);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('referenceText', referenceText);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🌐 Making request to:', `${apiUrl}/api/assess-pronunciation`);
      console.log('📦 FormData contents:', {
        audio: audioBlob.size + ' bytes',
        referenceText: referenceText
      });
      
      const response = await fetch(`${apiUrl}/api/assess-pronunciation`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Assessment result:', result);
        console.log('Assessment details:', result.assessment);
        console.log('Recognition status:', result.assessment?.RecognitionStatus);
        setAssessment(result);
      } else {
        console.error('Assessment failed:', response.status);
      }
    } catch (error) {
      console.error('Pronunciation assessment error:', error);
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-blue-600 mb-4">
        Practice Pronunciation: {spanishWord}
      </h3>
      
      <p className="text-gray-600 mb-4">
        Reference: "{referenceText}"
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-yellow-800 text-sm">
          💡 <strong>Recording Tips:</strong> Speak clearly and loudly. Make sure your microphone is working and not muted.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAssessing}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
        </button>

        {isAssessing && (
          <div className="text-center text-gray-600">
            🔄 Assessing pronunciation...
          </div>
        )}

        {assessment && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Assessment Results:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Overall Score:</span>
                <span className="font-bold text-blue-600">{assessment.overallScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-bold text-green-600">{assessment.accuracyScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Fluency:</span>
                <span className="font-bold text-purple-600">{assessment.fluencyScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Completeness:</span>
                <span className="font-bold text-orange-600">{assessment.completenessScore}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 