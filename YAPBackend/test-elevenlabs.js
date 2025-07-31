const fetch = require('node-fetch');
require('dotenv').config();

async function testElevenLabsAPI() {
  console.log('🧪 Testing ElevenLabs API Connection...\n');
  
  // Test 1: Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`API Key: ${process.env.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`Voice ID: ${process.env.ELEVENLABS_VOICE_ID ? '✅ Set' : '❌ Missing'}`);
  console.log('');
  
  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('❌ Error: ELEVENLABS_API_KEY not found in .env file');
    return;
  }
  
  // Test 2: Test API connection
  console.log('🔗 Testing API Connection...');
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID || '2k1RrkiAltTGNFiT6rL1'}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: 'Hola, esto es una prueba de ElevenLabs. ¿Cómo estás?',
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      console.log('✅ API Connection Successful!');
      console.log(`📊 Audio Size: ${audioBuffer.byteLength} bytes`);
      console.log(`🎵 Status: ${response.status} ${response.statusText}`);
      
      // Save test audio file
      const fs = require('fs');
      fs.writeFileSync('test_output.mp3', Buffer.from(audioBuffer));
      console.log('💾 Test audio saved as: test_output.mp3');
      
    } else {
      console.log('❌ API Connection Failed!');
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.log('🔑 Error: Invalid API key. Please check your ELEVENLABS_API_KEY in .env file');
      } else if (response.status === 404) {
        console.log('🎤 Error: Voice ID not found. Please check your ELEVENLABS_VOICE_ID');
      }
      
      const errorText = await response.text();
      console.log(`Error Details: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  
  console.log('\n🧪 Test completed!');
}

// Test the backend endpoint
async function testBackendEndpoint() {
  console.log('\n🌐 Testing Backend Endpoint...');
  
  try {
    const response = await fetch('http://localhost:3001/api/elevenlabs-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hola, esto es una prueba del backend',
        voiceId: '2k1RrkiAltTGNFiT6rL1'
      })
    });
    
    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      console.log('✅ Backend Endpoint Working!');
      console.log(`📊 Audio Size: ${audioBuffer.byteLength} bytes`);
      
      // Save backend test audio
      const fs = require('fs');
      fs.writeFileSync('test_backend_output.mp3', Buffer.from(audioBuffer));
      console.log('💾 Backend test audio saved as: test_backend_output.mp3');
      
    } else {
      console.log('❌ Backend Endpoint Failed!');
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      const errorText = await response.text();
      console.log(`Error Details: ${errorText}`);
    }
    
  } catch (error) {
    console.log('❌ Backend Error:', error.message);
    console.log('💡 Make sure the backend server is running on port 3001');
  }
}

// Run tests
async function runTests() {
  console.log('🚀 ElevenLabs API Test Suite\n');
  console.log('=' .repeat(50));
  
  await testElevenLabsAPI();
  
  console.log('\n' + '=' .repeat(50));
  
  await testBackendEndpoint();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error); 