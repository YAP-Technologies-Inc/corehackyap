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
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recordingStartTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      console.log('🎤 Starting audio recording...');
      console.log('🌐 Browser:', navigator.userAgent);
      console.log('📱 User Agent:', navigator.userAgent.includes('Safari') ? 'Safari' : 'Other browser');
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        console.error('❌ MediaRecorder not supported in this browser');
        alert('Audio recording is not supported in this browser. Please use Safari for the best experience.');
        return;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ getUserMedia not supported');
        alert('Microphone access is not supported in this browser. Please use Safari.');
        return;
      }
      
      // Request audio with settings optimized for Azure Speech Services
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100, // Use higher sample rate for better quality
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        } 
      });
      
      console.log('✅ Microphone access granted');
      console.log('🎵 Audio tracks:', stream.getAudioTracks().length);
      
      // Try different MIME types in order of preference
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mp3',
        'audio/wav'
      ];
      
      let mimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log('✅ Supported MIME type:', type);
          break;
        } else {
          console.log('❌ Not supported:', type);
        }
      }
      
      // If no specific MIME type is supported, try with browser default
      if (!mimeType) {
        console.log('⚠️ No specific MIME type supported, using browser default');
        mimeType = '';
      }
      
      console.log('🎯 Using MIME type:', mimeType || 'browser default');
      const mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      const finalMimeType = mimeType; // Store for use in onstop

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 Audio chunk received:', event.data.size, 'bytes');
        } else {
          console.warn('⚠️ Empty audio chunk received');
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.error('❌ No audio chunks received');
          alert('No audio data recorded. Please try again.');
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType });
        console.log('Audio blob size:', audioBlob.size, 'bytes');
        console.log('Number of audio chunks:', audioChunksRef.current.length);
        console.log('Recording duration:', Date.now() - recordingStartTimeRef.current, 'ms');
        console.log('Audio MIME type:', finalMimeType);
        
        if (audioBlob.size < 5000) {
          console.error('❌ Audio blob too small - likely silent recording');
          alert('No audio detected. Please speak clearly when recording.');
          return;
        }
        
        // Check if we have enough chunks with substantial data
        const totalChunkSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('📊 Total chunk size:', totalChunkSize, 'bytes');
        
        if (totalChunkSize < 5000) {
          console.error('❌ Insufficient audio data collected');
          alert('Not enough audio data recorded. Please try again and speak clearly.');
          return;
        }
        
        // Check for valid audio duration with timeout
        const audio = new Audio();
        audio.src = URL.createObjectURL(audioBlob);
        
        // Set a timeout for audio loading
        const audioLoadTimeout = setTimeout(() => {
          console.error('❌ Audio loading timeout - blob may be corrupted');
          alert('Audio recording failed. Please try again with Safari browser.');
        }, 5000); // 5 second timeout
        
        audio.onloadedmetadata = () => {
          clearTimeout(audioLoadTimeout);
          const duration = audio.duration;
          console.log('⏱️ Audio duration:', duration, 'seconds');
          
          if (duration < 1) {
            console.error('❌ Audio too short:', duration, 'seconds');
            alert('Recording too short. Please record for at least 3 seconds.');
            return;
          }
          
          if (duration === Infinity || isNaN(duration)) {
            console.error('❌ Invalid audio duration:', duration);
            console.log('🔍 Audio blob details:', {
              size: audioBlob.size,
              type: audioBlob.type
            });
            
            // Try to proceed anyway if the blob has substantial data
            if (audioBlob.size > 10000) {
              console.log('⚠️ Proceeding with assessment despite duration issue - blob has substantial data');
              assessPronunciation(audioBlob);
            } else {
              alert('Audio recording failed. Please try again with Safari browser.');
            }
            return;
          }
          
          console.log('✅ Audio validation passed, proceeding with assessment...');
          assessPronunciation(audioBlob);
        };
        
        audio.onerror = (error) => {
          clearTimeout(audioLoadTimeout);
          console.error('❌ Error loading audio for duration check:', error);
          
          // Try to proceed anyway if the blob has substantial data
          if (audioBlob.size > 10000) {
            console.log('⚠️ Proceeding with assessment despite audio loading error - blob has substantial data');
            assessPronunciation(audioBlob);
          } else {
            alert('Audio recording failed. Please try again with Safari browser.');
          }
        };
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        alert('Audio recording failed. Please try again.');
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      console.log('🎙️ Recording started at:', new Date().toISOString());
      
      // Start audio level monitoring
      startAudioLevelMonitoring(stream);
      
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone permission denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          alert('Audio recording not supported in this browser. Please use Safari.');
        } else {
          alert(`Audio recording failed: ${error.message}. Please try again.`);
        }
      } else {
        alert('Audio recording failed. Please try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      const recordingDuration = Date.now() - recordingStartTimeRef.current;
      
      // Ensure minimum recording time of 3 seconds for better assessment
      if (recordingDuration < 3000) {
        alert('Please record for at least 3 seconds to get an accurate assessment.');
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

  const startAudioLevelMonitoring = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let audioLevelSum = 0;
    let audioLevelCount = 0;
    
    const checkAudioLevel = () => {
      if (isRecording) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        audioLevelSum += average;
        audioLevelCount++;
        setAudioLevel(average);
        console.log('🎵 Audio level:', average, 'Average:', Math.round(audioLevelSum / audioLevelCount));
        requestAnimationFrame(checkAudioLevel);
      }
    };
    checkAudioLevel();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-blue-600 mb-4">
        Practice Pronunciation: {spanishWord}
      </h3>
      
      {/* Browser Warning */}
      {typeof window !== 'undefined' && !navigator.userAgent.includes('Safari') && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800">
          <p className="text-sm font-medium">⚠️ Browser Compatibility Notice</p>
          <p className="text-xs">Audio recording works best with Safari browser. Other browsers may have limited support.</p>
        </div>
      )}
      
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

        {/* Audio Level Indicator */}
        {isRecording && (
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Audio Level:</span>
              <span className="text-sm font-semibold">{audioLevel}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {audioLevel > 10 ? '✅ Good audio detected' : '🔇 Speak louder'}
            </p>
          </div>
        )}

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