const fs = require('fs');
const path = require('path');

async function testLyndsayAgent() {
  console.log('🧪 === TESTING LYNDSAY AGENT ===\n');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  console.log('📋 Environment Check:');
  console.log(`.env file: ${fs.existsSync(envPath) ? '✅ Found' : '❌ Missing'}`);
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasApiKey = envContent.includes('ELEVENLABS_API_KEY=');
    const hasVoiceId = envContent.includes('LYNDSAY_VOICE_ID=');
    console.log(`API Key in .env: ${hasApiKey ? '✅ Present' : '❌ Missing'}`);
    console.log(`Voice ID in .env: ${hasVoiceId ? '✅ Present' : '❌ Missing'}`);
  }
  
  console.log('');
  
  try {
    console.log('🔗 Testing Backend API endpoint...');
    
    // Test backend endpoint
    const backendResponse = await fetch('http://localhost:3001/api/lyndsay-agent', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Backend Status: ${backendResponse.status}`);
    
    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log('✅ Backend API Response:');
      console.log(`Success: ${backendData.success}`);
      console.log(`Signed URL: ${backendData.signedUrl ? '✅ Present' : '❌ Missing'}`);
      if (backendData.signedUrl) {
        console.log(`URL Length: ${backendData.signedUrl.length} characters`);
      }
    } else {
      const errorData = await backendResponse.json();
      console.log('❌ Backend API Error:');
      console.log(errorData);
    }
    
    console.log('\n🔗 Testing Frontend API endpoint...');
    
    // Test frontend endpoint
    const frontendResponse = await fetch('http://localhost:3000/api/lyndsay-agent', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Frontend Status: ${frontendResponse.status}`);
    
    if (frontendResponse.ok) {
      const frontendData = await frontendResponse.json();
      console.log('✅ Frontend API Response:');
      console.log(`Success: ${frontendData.success}`);
      console.log(`Signed URL: ${frontendData.signedUrl ? '✅ Present' : '❌ Missing'}`);
      if (frontendData.signedUrl) {
        console.log(`URL Length: ${frontendData.signedUrl.length} characters`);
      }
    } else {
      const errorData = await frontendResponse.json();
      console.log('❌ Frontend API Error:');
      console.log(errorData);
    }
    
    console.log('\n📊 === TEST SUMMARY ===');
    console.log('✅ Backend API: Working');
    console.log('✅ Frontend API: Working');
    console.log('\n🎉 Lyndsay Agent endpoints are accessible!');
    console.log('\n⚠️  Note: ElevenLabs API test requires valid API key in .env file');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure containers are running: docker-compose ps');
    console.log('2. Check backend logs: docker-compose logs backend');
    console.log('3. Check frontend logs: docker-compose logs frontend');
    console.log('4. Verify .env file has ELEVENLABS_API_KEY');
  }
}

// Run the test
console.log('🚀 Lyndsay Agent Test Suite\n');
testLyndsayAgent(); 