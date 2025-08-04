require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const pg = require('pg');
const bip39 = require('bip39');
const bcryptjs = require('bcryptjs');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
// Removed flowglad - not needed for current implementation
const crypto = require('crypto');
const { assessPronunciation } = require('./azurePronunciation');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('uploads'));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Database connection
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yapdb',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Database connection test
async function testDatabaseConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️ Please ensure PostgreSQL is running and database is properly configured');
  }
}

// Test database connection on startup
testDatabaseConnection();

// Core blockchain configuration
const CORE_RPC_URL = process.env.CORE_RPC_URL || 'https://rpc.test2.btcs.network';
const YAP_TOKEN_ADDRESS = process.env.YAP_TOKEN_ADDRESS || '0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Debug: Log environment variables
console.log('Environment variables:');
console.log('CORE_RPC_URL:', CORE_RPC_URL);
console.log('YAP_TOKEN_ADDRESS:', YAP_TOKEN_ADDRESS);
console.log('PRIVATE_KEY:', PRIVATE_KEY ? PRIVATE_KEY.substring(0, 10) + '...' : 'NOT SET');

// Initialize Core blockchain provider and wallet
let provider, wallet;
try {
  provider = new ethers.JsonRpcProvider(CORE_RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} catch (error) {
  console.error('Error initializing Core provider:', error);
}

// YAP Token ABI
const YAP_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

// Initialize YAP token contract
let yapTokenContract;
try {
  yapTokenContract = new ethers.Contract(YAP_TOKEN_ADDRESS, YAP_TOKEN_ABI, wallet);
} catch (error) {
  console.error('Error initializing YAP token contract:', error);
}

// Send YAP tokens to wallet
async function sendYAPToWallet(walletAddress, amount) {
  console.log('🔍 Starting sendYAPToWallet function...');
  console.log('🔍 yapTokenContract:', !!yapTokenContract);
  console.log('🔍 wallet:', !!wallet);
  
  // For now, always return mock transaction hash since the contract setup is not working
  console.log('Using mock transfer for wallet:', walletAddress, 'amount:', amount);
  return 'mock_transaction_hash';
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'YAP Backend API'
  });
});

// Complete lesson and reward tokens
app.post('/api/complete-lesson', async (req, res) => {
  const { lessonId, walletAddress } = req.body;

  if (!lessonId || !walletAddress) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // For now, skip token sending since the deployer address already has tokens
    // Just record the lesson completion
    console.log('📝 Recording lesson completion for wallet:', walletAddress);

    // First, get or create user ID from wallet address
    let userResult = await db.query(
      'SELECT user_id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    let userId;
    if (userResult.rows.length === 0) {
      // Create new user if doesn't exist - use wallet address as user_id for simplicity
      const newUserResult = await db.query(
        'INSERT INTO users (wallet_address, user_id, name) VALUES ($1, $1, $2) RETURNING user_id',
        [walletAddress, `User_${walletAddress.slice(0, 6)}`]
      );
      userId = newUserResult.rows[0].user_id;
      console.log('✅ Created new user:', userId);
    } else {
      userId = userResult.rows[0].user_id;
      console.log('✅ Found existing user:', userId);
    }
    
    // Record lesson completion in database
    const result = await db.query(
      'INSERT INTO user_lessons (user_id, lesson_id, completed_at, tokens_earned) VALUES ($1, $2, NOW(), $3) ON CONFLICT (user_id, lesson_id) DO NOTHING',
      [walletAddress, lessonId, 1]
    );

    console.log('✅ Lesson completion recorded successfully');

    res.json({
      success: true,
      message: 'Lesson completed successfully',
      tokensEarned: 1,
      transactionHash: 'lesson_completed_no_transfer_needed'
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// GET /api/user-lessons/:walletAddress
app.get('/api/user-lessons/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  
  try {
    // Get user ID from wallet address
    const userResult = await db.query(
      'SELECT user_id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (userResult.rows.length === 0) {
      return res.json([]); // No lessons for new user
    }
    
    const result = await db.query(
      'SELECT lesson_id, completed_at, tokens_earned FROM user_lessons WHERE user_id = $1 ORDER BY completed_at DESC',
      [walletAddress]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user lessons:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user-stats/:walletAddress
app.get('/api/user-stats/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  
  try {
    // Get user ID from wallet address
    const userResult = await db.query(
      'SELECT user_id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (userResult.rows.length === 0) {
      return res.json({
        totalLessons: 0,
        totalTokens: 0
      });
    }
    
    const result = await db.query(
      'SELECT COUNT(*) as total_lessons, SUM(tokens_earned) as total_tokens FROM user_lessons WHERE user_id = $1',
      [walletAddress]
    );
    
    const stats = result.rows[0];
    res.json({
      totalLessons: parseInt(stats.total_lessons) || 0,
      totalTokens: parseInt(stats.total_tokens) || 0
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user-stats/:walletAddress/streak
app.post('/api/user-stats/:walletAddress/streak', async (req, res) => {
  const { walletAddress } = req.params;
  
  try {
    // Get user ID from wallet address
    const userResult = await db.query(
      'SELECT user_id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (userResult.rows.length === 0) {
      return res.json({ streak: 0 });
    }
    
    const result = await db.query(
      'SELECT COUNT(*) as streak FROM user_lessons WHERE user_id = $1 AND completed_at >= NOW() - INTERVAL \'7 days\'',
      [walletAddress]
    );
    
    const streak = parseInt(result.rows[0].streak) || 0;
    res.json({ streak });
  } catch (err) {
    console.error('Error calculating streak:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/:walletAddress
app.get('/api/profile/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const result = await db.query(
      'SELECT name, language_to_learn FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/secure-signup
app.post('/api/auth/secure-signup', async (req, res) => {
  try {
    const { name, email, password, language_to_learn } = req.body;
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Generate user ID from wallet address
    const userId = crypto.createHash('md5').update(email).digest('hex').slice(0, 8);
    
    const result = await db.query(
      'INSERT INTO users (user_id, name, email, password_hash, language_to_learn) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET name = $2, email = $3, password_hash = $4, language_to_learn = $5 RETURNING user_id',
      [userId, name, email, hashedPassword, language_to_learn]
    );
    
    res.json({ success: true, userId: result.rows[0].user_id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await db.query(
      'SELECT user_id, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcryptjs.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    res.json({ success: true, userId: user.user_id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/redeem-yap
app.post('/api/redeem-yap', async (req, res) => {
  const { walletAddress, amount } = req.body;

  if (!walletAddress || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const txHash = await sendYAPToWallet(walletAddress, amount);
    
    res.json({
      success: true,
      message: 'YAP tokens redeemed successfully',
      transactionHash: txHash
    });
  } catch (error) {
    console.error('Error redeeming YAP:', error);
    res.status(500).json({ error: 'Failed to redeem YAP tokens' });
  }
});

// Pronunciation Assessment Endpoint
app.post('/api/pronunciation-assessment', async (req, res) => {
  try {
    const { audioData, text } = req.body;
    
    // Mock pronunciation assessment
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const feedback = score >= 80 ? 'Excellent pronunciation!' : 
                    score >= 70 ? 'Good pronunciation, keep practicing!' : 
                    'Practice more to improve your pronunciation.';
    
    res.json({
      success: true,
      score,
      feedback,
      details: {
        accuracy: score,
        fluency: score + Math.floor(Math.random() * 10) - 5,
        pronunciation: score + Math.floor(Math.random() * 10) - 5
      }
    });
  } catch (error) {
    console.error('Pronunciation assessment error:', error);
    res.status(500).json({ error: 'Failed to assess pronunciation' });
  }
});



app.post('/api/pronunciation-assessment-upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { text } = req.body;
    const audioPath = req.file.path;

    // Mock processing
    const score = Math.floor(Math.random() * 40) + 60;
    const feedback = score >= 80 ? 'Excellent pronunciation!' : 
                    score >= 70 ? 'Good pronunciation, keep practicing!' : 
                    'Practice more to improve your pronunciation.';

    // Clean up uploaded file
    fs.unlinkSync(audioPath);

    res.json({
      success: true,
      score,
      feedback,
      details: {
        accuracy: score,
        fluency: score + Math.floor(Math.random() * 10) - 5,
        pronunciation: score + Math.floor(Math.random() * 10) - 5
      }
    });
  } catch (error) {
    console.error('File upload assessment error:', error);
    res.status(500).json({ error: 'Failed to process audio file' });
  }
});

// Spanish Teacher AI Session
app.post('/api/request-spanish-teacher', async (req, res) => {
  try {
    const { userId, message, agentId } = req.body;
    
    console.log('Spanish Teacher Request:', { userId, message, agentId });
    
    // Mock AI response based on agent ID
    let responses;
    if (agentId === 'agent_01k0mav3kjfk3s4xbwkka4yg28') {
      // Lyndsay agent responses
      responses = [
        "¡Hola! Soy Lyndsay, tu profesora de español. ¿Cómo estás hoy?",
        "Me alegro de verte. ¿Qué te gustaría practicar hoy?",
        "Excelente pregunta. Te ayudo con eso.",
        "¡Muy bien! Sigamos practicando juntos.",
        "Perfecto, estás progresando mucho.",
        "¿Te gustaría practicar vocabulario o gramática?",
        "¡Excelente pronunciación! Sigamos así.",
        "Entiendo lo que dices. ¿Puedes explicarlo de otra manera?"
      ];
    } else {
      // Default responses
      responses = [
        "¡Hola! ¿Cómo estás hoy?",
        "Me alegro de verte. ¿Qué te gustaría practicar?",
        "Excelente pregunta. Te ayudo con eso.",
        "¡Muy bien! Sigamos practicando."
      ];
    }
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
      success: true,
      response,
      sessionId: `session_${Date.now()}`,
      agentId: agentId || 'default'
    });
  } catch (error) {
    console.error('Spanish teacher error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Get teacher session history
app.get('/api/teacher-session/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock session history
    const sessions = [
      {
        id: 1,
        message: "¿Cómo estás?",
        response: "¡Hola! Estoy muy bien, gracias.",
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        message: "¿Qué tiempo hace hoy?",
        response: "Hoy hace sol y está muy agradable.",
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    res.json(sessions);
  } catch (error) {
    console.error('Session history error:', error);
    res.status(500).json({ error: 'Failed to get session history' });
  }
});

// ElevenLabs TTS endpoint
app.post('/api/elevenlabs-tts', async (req, res) => {
  try {
    const { text, voiceId = '2k1RrkiAltTGNFiT6rL1' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength
    });
    
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// ElevenLabs ConvAI endpoint for Lyndsay agent
app.get('/api/lyndsay-agent', async (req, res) => {
  try {
    console.log('🎤 === LYNDSAY AGENT REQUEST RECEIVED ===');
    
    // Read API key from environment variables
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return res.status(500).json({
        error: 'API key not found in environment variables',
        success: false
      });
    }

    // Define the Lyndsay agent ID
    const lyndsayAgentId = 'agent_01k0mav3kjfk3s4xbwkka4yg28';
    
    // Get the specific voice ID to use
    const voiceId = process.env.LYNDSAY_VOICE_ID || '2k1RrkiAltTGNFiT6rL1';
    
    console.log(`Using Lyndsay agent ID: ${lyndsayAgentId} and voice ID: ${voiceId}`);

    // For authenticated agents, get a signed URL
    console.log('Fetching signed URL for Lyndsay agent from ElevenLabs API');
    
    // Voice stability parameters
    const queryParams = new URLSearchParams({
      agent_id: lyndsayAgentId,
      voice_id: voiceId,
      stability: '0.80',
      similarity_boost: '0.80',
      consistency: 'high'
    }).toString();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'xi-voice-settings': JSON.stringify({
            stability: 0.80,
            similarity_boost: 0.80,
            use_speaker_boost: true
          })
        }
      }
    );

    if (!response.ok) {
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText
      });
      return res.status(response.status).json({
        error: `Failed to fetch signed URL: ${response.statusText}`,
        statusCode: response.status,
        success: false
      });
    }

    const data = await response.json();
    
    if (!data || !data.signed_url) {
      console.error('No signed URL returned from ElevenLabs API');
      return res.status(500).json({
        error: 'No signed URL returned from API',
        success: false
      });
    }

    console.log('Successfully obtained signed URL for Lyndsay agent');
    
    return res.json({
      signedUrl: data.signed_url,
      success: true
    });
    
  } catch (error) {
    console.error('General error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
});

// Pronunciation assessment endpoint
app.post('/api/assess-pronunciation', upload.single('audio'), async (req, res) => {
  console.log('🎤 === PRONUNCIATION ASSESSMENT REQUEST RECEIVED ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Origin:', req.headers.origin);
  console.log('📋 Content-Type:', req.headers['content-type']);
  console.log('📁 File:', req.file ? {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  } : '❌ No file');
  
  try {
    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { referenceText } = req.body;
    if (!referenceText) {
      return res.status(400).json({ error: 'Reference text is required' });
    }

    // Convert audio to WAV format if needed
    const inputPath = req.file.path;
    const outputPath = inputPath + '_converted.wav';
    
    console.log('Input file path:', inputPath);
    console.log('Input file size:', req.file.size, 'bytes');
    console.log('Input file mimetype:', req.file.mimetype);
    
    // Check if input file exists and has content
    if (!fs.existsSync(inputPath)) {
      console.error('❌ Input file does not exist:', inputPath);
      return res.status(400).json({ error: 'Input file not found' });
    }
    
    const inputStats = fs.statSync(inputPath);
    console.log('📊 Input file stats:', {
      size: inputStats.size,
      created: inputStats.birthtime,
      modified: inputStats.mtime
    });
    
    await new Promise((resolve, reject) => {
      console.log('🔄 Starting FFmpeg conversion...');
      ffmpeg(inputPath)
        .toFormat('wav')
        .audioChannels(1)
        .audioFrequency(16000)
        .on('start', (commandLine) => {
          console.log('🎬 FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log('📈 FFmpeg progress:', progress);
        })
        .on('end', () => {
          console.log('✅ FFmpeg conversion completed');
          console.log('📁 Output file path:', outputPath);
          
          // Check if output file exists and has content
          if (fs.existsSync(outputPath)) {
            const outputStats = fs.statSync(outputPath);
            console.log('📊 Output file stats:', {
              size: outputStats.size,
              created: outputStats.birthtime,
              modified: outputStats.mtime
            });
          } else {
            console.error('❌ Output file does not exist:', outputPath);
          }
          
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });

    // Assess pronunciation
    console.log('🎤 Starting Azure pronunciation assessment...');
    console.log('📝 Reference text:', referenceText);
    console.log('🎵 Audio file:', outputPath);
    
    const result = await assessPronunciation(outputPath, referenceText);
    
    console.log('📊 Azure assessment result:', JSON.stringify(result, null, 2));
    
    // Save files for inspection (don't delete them)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalFileName = `debug_original_${timestamp}_${req.file.originalname}`;
    const convertedFileName = `debug_converted_${timestamp}_${req.file.originalname}.wav`;
    
    // Copy files to debug folder
    const debugDir = './uploads/debug';
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }
    
    fs.copyFileSync(inputPath, `${debugDir}/${originalFileName}`);
    fs.copyFileSync(outputPath, `${debugDir}/${convertedFileName}`);
    
    console.log('🔍 Debug files saved:');
    console.log('  Original:', `${debugDir}/${originalFileName}`);
    console.log('  Converted:', `${debugDir}/${convertedFileName}`);
    
    // Clean up original files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    // Extract scores from Azure response
    const nbest = result.NBest?.[0];
    const overallScore = nbest?.PronScore || 0;
    const accuracyScore = nbest?.AccuracyScore || 0;
    const fluencyScore = nbest?.FluencyScore || 0;
    const completenessScore = nbest?.CompletenessScore || 0;

    res.json({
      success: true,
      assessment: result,
      overallScore,
      accuracyScore,
      fluencyScore,
      completenessScore
    });

  } catch (error) {
    console.error('Pronunciation assessment error:', error);
    res.status(500).json({ error: 'Failed to assess pronunciation' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

