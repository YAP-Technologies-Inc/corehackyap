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

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Database configuration
const db = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yap_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Ethereum configuration
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
const YAP_TOKEN_ADDRESS = process.env.YAP_TOKEN_ADDRESS || '0x1234567890123456789012345678901234567890';
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

// GET /api/user-lessons/:userId
app.get('/api/user-lessons/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await db.query(
      'SELECT lesson_id, completed_at, tokens_earned FROM user_lessons WHERE user_id = $1 ORDER BY completed_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user lessons:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user-stats/:userId
app.get('/api/user-stats/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await db.query(
      'SELECT COUNT(*) as total_lessons, SUM(tokens_earned) as total_tokens FROM user_lessons WHERE user_id = $1',
      [userId]
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

// POST /api/user-stats/:userId/streak
app.post('/api/user-stats/:userId/streak', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await db.query(
      'SELECT COUNT(*) as streak FROM user_lessons WHERE user_id = $1 AND completed_at >= NOW() - INTERVAL \'7 days\'',
      [userId]
    );
    
    const streak = parseInt(result.rows[0].streak) || 0;
    res.json({ streak });
  } catch (err) {
    console.error('Error calculating streak:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/:userId
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      'SELECT name, language_to_learn FROM users WHERE user_id = $1',
      [userId]
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

// File upload for pronunciation assessment
const upload = multer({ dest: 'uploads/' });

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

