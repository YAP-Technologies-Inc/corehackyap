// test-pronunciation.js
require('dotenv').config();
const { assessPronunciation } = require('./azurePronunciation');
const fs = require('fs');

console.log('🚀 Azure Pronunciation Assessment Test');
console.log('=====================================');

// Test configuration
const testAudioPath = './test.wav'; // Use existing test file
const referenceText = 'hola';

async function testPronunciationAssessment() {
  try {
    console.log('📋 Test Configuration:');
    console.log(`Audio file: ${testAudioPath}`);
    console.log(`Reference text: "${referenceText}"`);
    console.log(`Azure API Key: ${process.env.AZURE_SPEECH_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log('');

    // Check if test audio file exists
    if (!fs.existsSync(testAudioPath)) {
      console.error('❌ Test audio file not found:', testAudioPath);
      console.log('💡 Please ensure test.wav exists in the current directory');
      return;
    }

    console.log('🔗 Testing Azure Pronunciation Assessment...');
    
    // Call the assessment function
    const result = await assessPronunciation(testAudioPath, referenceText);
    
    console.log('✅ Assessment completed successfully!');
    console.log('');
    console.log('📊 Assessment Results:');
    console.log('=====================');
    
    if (result.PronunciationAssessment) {
      const assessment = result.PronunciationAssessment;
      console.log(`Overall Score: ${assessment.OverallScore || 'N/A'}%`);
      console.log(`Accuracy Score: ${assessment.AccuracyScore || 'N/A'}%`);
      console.log(`Fluency Score: ${assessment.FluencyScore || 'N/A'}%`);
      console.log(`Completeness Score: ${assessment.CompletenessScore || 'N/A'}%`);
    } else {
      console.log('⚠️ No pronunciation assessment data in response');
      console.log('Raw response:', JSON.stringify(result, null, 2));
    }

    // Check for word-level feedback
    if (result.NBest && result.NBest[0] && result.NBest[0].Words) {
      console.log('');
      console.log('📝 Word-level Feedback:');
      console.log('======================');
      result.NBest[0].Words.forEach((word, index) => {
        console.log(`${index + 1}. "${word.Word}": ${word.AccuracyScore}% accuracy`);
      });
    }

  } catch (error) {
    console.error('❌ Assessment failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('');
      console.log('💡 This might be an Azure API key issue. Check your AZURE_SPEECH_KEY in .env');
    }
    
    if (error.message.includes('403')) {
      console.log('');
      console.log('💡 This might be a permissions issue. Check your Azure Speech Services subscription.');
    }
  }
}

// Run the test
testPronunciationAssessment(); 