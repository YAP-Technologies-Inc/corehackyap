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

// Check and migrate database schema (run only once)
async function checkAndMigrateDatabase() {
  try {
    // Check if tokens_earned column exists
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_lessons' AND column_name = 'tokens_earned'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('🔄 Adding tokens_earned column to user_lessons table...');
      await db.query('ALTER TABLE user_lessons ADD COLUMN tokens_earned INTEGER DEFAULT 1');
      console.log('✅ Database migration completed');
    } else {
      console.log('✅ Database schema is up to date');
    }
    
    // Check if wallet_address column exists in users table
    const checkWalletColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'wallet_address'
    `);
    
    if (checkWalletColumn.rows.length === 0) {
      console.log('🔄 Adding wallet_address column to users table...');
      await db.query('ALTER TABLE users ADD COLUMN wallet_address VARCHAR(42)');
      console.log('✅ Users table migration completed');
    } else {
      console.log('✅ Users table schema is up to date');
    }
    
    // Check if user_id column is set up as SERIAL
    const checkUserIdColumn = await db.query(`
      SELECT column_default, is_nullable, data_type
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'user_id'
    `);
    
    if (checkUserIdColumn.rows.length > 0) {
      const columnInfo = checkUserIdColumn.rows[0];
      console.log('🔍 User ID column info:', columnInfo);
      
      if (columnInfo.data_type === 'integer' && (!columnInfo.column_default || !columnInfo.column_default.includes('nextval'))) {
        console.log('🔄 Fixing user_id column to be auto-incrementing...');
        // Create a sequence for user_id
        await db.query('CREATE SEQUENCE IF NOT EXISTS users_user_id_seq');
        // Set the sequence as default for user_id
        await db.query('ALTER TABLE users ALTER COLUMN user_id SET DEFAULT nextval(\'users_user_id_seq\')');
        // Set the sequence to start from the current max value
        await db.query('SELECT setval(\'users_user_id_seq\', COALESCE((SELECT MAX(CAST(user_id AS INTEGER)) FROM users), 0) + 1)');
        console.log('✅ User ID column migration completed');
      } else if (columnInfo.data_type === 'text') {
        console.log('⚠️ User ID column is text type - using simple integer approach');
        // For text user_id, we'll use a simple approach
        console.log('✅ User ID column is text type - will handle manually');
      } else {
        console.log('✅ User ID column is properly configured');
      }
    }
    
    // Check if user_lessons.user_id column is integer and needs to be changed to string
    const checkUserLessonsUserIdColumn = await db.query(`
      SELECT data_type
      FROM information_schema.columns 
      WHERE table_name = 'user_lessons' AND column_name = 'user_id'
    `);
    
    if (checkUserLessonsUserIdColumn.rows.length > 0) {
      const columnInfo = checkUserLessonsUserIdColumn.rows[0];
      console.log('🔍 User Lessons User ID column info:', columnInfo);
      
      if (columnInfo.data_type === 'integer') {
        console.log('🔄 Changing user_lessons.user_id from integer to string...');
        // Change the column type to VARCHAR
        await db.query('ALTER TABLE user_lessons ALTER COLUMN user_id TYPE VARCHAR(42)');
        console.log('✅ User Lessons User ID column migration completed');
      } else {
        console.log('✅ User Lessons User ID column is already string type');
      }
    }
    
    // Check if user_lessons.lesson_id column is integer and needs to be changed to string
    const checkUserLessonsLessonIdColumn = await db.query(`
      SELECT data_type
      FROM information_schema.columns 
      WHERE table_name = 'user_lessons' AND column_name = 'lesson_id'
    `);
    
    if (checkUserLessonsLessonIdColumn.rows.length > 0) {
      const columnInfo = checkUserLessonsLessonIdColumn.rows[0];
      console.log('🔍 User Lessons Lesson ID column info:', columnInfo);
      
      if (columnInfo.data_type === 'integer') {
        console.log('🔄 Changing user_lessons.lesson_id from integer to string...');
        // Change the column type to VARCHAR
        await db.query('ALTER TABLE user_lessons ALTER COLUMN lesson_id TYPE VARCHAR(255)');
        console.log('✅ User Lessons Lesson ID column migration completed');
      } else {
        console.log('✅ User Lessons Lesson ID column is already string type');
      }
    }
  } catch (error) {
    console.error('❌ Database migration error:', error);
    console.log('⚠️ Continuing without migration - some features may not work properly');
  }
}

// Run migration on startup (only checks once)
checkAndMigrateDatabase();

// Ethereum configuration
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
const YAP_TOKEN_ADDRESS = process.env.YAP_TOKEN_ADDRESS || '0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Debug: Log environment variables
console.log('Environment variables:');
console.log('ETHEREUM_RPC_URL:', ETHEREUM_RPC_URL);
console.log('YAP_TOKEN_ADDRESS:', YAP_TOKEN_ADDRESS);
console.log('PRIVATE_KEY:', PRIVATE_KEY ? PRIVATE_KEY.substring(0, 10) + '...' : 'NOT SET');

// Initialize Ethereum provider and wallet
let provider, wallet;
try {
  provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} catch (error) {
  console.error('Error initializing Ethereum provider:', error);
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
  try {
    if (!yapTokenContract) {
      console.log('YAP token contract not available, using mock transfer');
      return 'mock_transaction_hash';
    }

    const decimals = await yapTokenContract.decimals();
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    const tx = await yapTokenContract.transfer(walletAddress, amountInWei);
    const receipt = await tx.wait();
    
    console.log('YAP tokens sent:', receipt.hash);
    return receipt.hash;
  } catch (error) {
    console.error('Error sending YAP tokens:', error);
    throw error;
  }
}

// API Routes

// Complete lesson and reward tokens
app.post('/api/complete-lesson', async (req, res) => {
  const { lessonId, walletAddress } = req.body;

  if (!lessonId || !walletAddress) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Send YAP tokens to user
    const txHash = await sendYAPToWallet(walletAddress, 1);

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
    } else {
      userId = userResult.rows[0].user_id;
    }
    
    // Record lesson completion in database
    const result = await db.query(
      'INSERT INTO user_lessons (user_id, lesson_id, completed_at, tokens_earned) VALUES ($1, $2, NOW(), $3) ON CONFLICT (user_id, lesson_id) DO NOTHING',
      [walletAddress, lessonId, 1]
    );

    res.json({
      success: true,
      message: 'Lesson completed successfully',
      tokensEarned: 1,
      transactionHash: txHash
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
    const { userId, message } = req.body;
    
    // Mock AI response
    const responses = [
      "¡Hola! ¿Cómo estás hoy?",
      "Me alegro de verte. ¿Qué te gustaría practicar?",
      "Excelente pregunta. Te ayudo con eso.",
      "¡Muy bien! Sigamos practicando."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
      success: true,
      response,
      sessionId: `session_${Date.now()}`
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

