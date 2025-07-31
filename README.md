# YAP Token System - Pond Hackathon

A complete Web3 language learning application with token rewards and consumption system built for the Pond Hackathon.

## 🚀 Features

### 🪙 YAP Token System
- **Token Rewards**: Students earn YAP tokens upon completing lessons
- **Token Consumption**: AI conversational features consume YAP tokens
- **Ethereum Integration**: Deployed on Sepolia testnet with smart contracts

### 🔗 MetaMask Wallet Integration
- Seamless MetaMask wallet connection
- Automatic network switching to Ethereum
- Real-time token and ETH balance display
- Secure transaction handling

### 🎓 Language Learning Platform
- Spanish language lessons with interactive content
- Progress tracking and statistics
- Daily learning streaks
- **Pronunciation assessment with Azure Speech Services**
- **High-quality text-to-speech with ElevenLabs**

### 🏗️ Technical Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Node.js, Express, PostgreSQL
- **Blockchain**: Ethereum Sepolia testnet, ethers.js
- **Smart Contracts**: Solidity, Hardhat deployment
- **AI Services**: Azure Speech Services, ElevenLabs TTS

---

## 📁 Project Structure

```
yap-integration-main/
├── yap-frontend-v2 copy/          # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js app router pages
│   │   ├── components/            # React components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   ├── lesson/           # Lesson components
│   │   │   ├── wallet/           # MetaMask integration
│   │   │   └── ui/               # UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # React context providers
│   │   └── mock/                 # Mock data
│   └── public/                   # Static assets
├── YAPBackend copy/              # Node.js backend server
│   ├── index.js                  # Main server file
│   ├── azurePronunciation.js     # Azure Speech Services integration
│   └── uploads/                  # File uploads directory
└── yap-token-deployment/         # Smart contract deployment
    ├── contracts/                # Solidity contracts
    ├── scripts/                  # Deployment scripts
    └── hardhat.config.js         # Hardhat configuration
```

---

## 🛠️ Quick Start

### Prerequisites
- **Node.js 18+** 
- **Safari Browser** (required for audio recording functionality)
- **MetaMask browser extension**
- **PostgreSQL database**
- **Infura API key** (for Ethereum RPC)
- **Etherscan API key** (for contract verification)
- **ElevenLabs API key** (for text-to-speech)
- **Azure Speech Services key** (for pronunciation assessment)

### 1. Clone Repository
```bash
git clone https://github.com/YAP-Technologies-Inc/pondhackathon.git
cd pondhackathon
```

### 2. Install Dependencies

#### Backend
```bash
cd "YAPBackend copy"
npm install
```

#### Frontend
```bash
cd "yap-frontend-v2 copy"
npm install
```

### 3. Environment Configuration

Create `.env` files in the respective directories:

#### Backend Environment (`YAPBackend copy/.env`)
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=yapdb
DB_PASSWORD=your_password
DB_PORT=5432

# Blockchain Configuration
YAP_TOKEN_ADDRESS=0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Azure Speech Services (Required for pronunciation assessment)
AZURE_SPEECH_KEY=your_azure_speech_key

# ElevenLabs API (Required for text-to-speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

#### Frontend Environment (`yap-frontend-v2 copy/.env`)
```env
# Token Contract Address
NEXT_PUBLIC_TOKEN_ADDRESS=0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c
NEXT_PUBLIC_NETWORK_ID=11155111

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# ElevenLabs Voice ID (Required for consistent TTS voice)
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=2k1RrkiAltTGNFiT6rL1
```

### 4. API Keys Setup

#### ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Create an account and get your API key
3. Add the key to `YAPBackend copy/.env` as `ELEVENLABS_API_KEY`

#### Azure Speech Services Key
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a Speech Service resource
3. Get your subscription key and region
4. Add the key to `YAPBackend copy/.env` as `AZURE_SPEECH_KEY`

### 5. Database Setup
```sql
-- Create database
CREATE DATABASE yapdb;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE user_lessons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    lesson_id VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tokens_earned INTEGER DEFAULT 1
);

-- Create user_stats table
CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_lessons INTEGER DEFAULT 0,
    total_tokens_earned INTEGER DEFAULT 0,
    total_tokens_spent INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE
);
```

### 6. Run the Application

#### Start Backend
```bash
cd "YAPBackend copy"
npm start
```
Backend runs on: http://localhost:3001

#### Start Frontend
```bash
cd "yap-frontend-v2 copy"
npm run dev
```
Frontend runs on: http://localhost:3000

**⚠️ Important**: Use **Safari browser** for the best audio recording experience. The pronunciation assessment feature works best with Safari's MediaRecorder API.

---

## 🪙 Smart Contract Deployment

### Deploy YAP Token Contract

1. **Navigate to deployment directory**:
```bash
cd yap-token-deployment
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (`.env`):
```env
PRIVATE_KEY=0xYOUR_METAMASK_PRIVATE_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

4. **Compile contracts**:
```bash
npm run compile
```

5. **Deploy to Sepolia testnet**:
```bash
npm run deploy:sepolia
```

6. **Verify contract** (optional):
```bash
npm run verify:sepolia
```

### Contract Details
- **Token Name**: YAP Token
- **Token Symbol**: YAP
- **Total Supply**: 1,000,000 YAP
- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c`

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/secure-signup` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/profile/:userId` - Get user profile
- `GET /api/user-stats/:userId` - Get user statistics
- `GET /api/user-stats/:userId/streak` - Get user streak

### Lessons & Tokens
- `POST /api/complete-lesson` - Complete lesson and earn tokens
- `GET /api/user-lessons/:userId` - Get user's completed lessons
- `POST /api/redeem-yap` - Consume tokens for AI features

### AI Features
- `POST /api/elevenlabs-tts` - Text-to-speech with ElevenLabs
- `POST /api/assess-pronunciation` - Assess pronunciation with Azure
- `POST /api/request-spanish-teacher` - Request AI teacher session
- `GET /api/teacher-session/:userId` - Get teacher session data

---

## 🎯 Usage Guide

### 1. Connect MetaMask Wallet
1. Install MetaMask browser extension
2. Click "Connect MetaMask" button
3. Authorize connection and switch to Ethereum network

### 2. Complete Lessons to Earn Tokens
1. Select a lesson from the dashboard
2. Complete the lesson content
3. System automatically sends 1 YAP token to your wallet
4. View your token balance on the dashboard

### 3. Use AI Features (Consume Tokens)
1. Ensure you have sufficient YAP tokens
2. Click "Spanish Teacher" feature
3. System consumes 1 YAP token for AI conversation
4. Enjoy personalized language learning assistance

### 4. Pronunciation Practice
1. **Use Safari browser** for best audio recording experience
2. Click "Listen" button to hear Spanish words
3. Click "Practice Pronunciation" to record your speech
4. Get instant feedback on your pronunciation accuracy

### 5. Track Progress
- View completed lessons in your profile
- Monitor token earnings and spending
- Track daily learning streaks
- Check overall statistics

---

## 🔧 Development

### Frontend Development
```bash
cd "yap-frontend-v2 copy"
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
```

### Backend Development
```bash
cd "YAPBackend copy"
npm start            # Start server
npm run dev          # Development with nodemon
```

### Smart Contract Development
```bash
cd yap-token-deployment
npm run compile      # Compile contracts
npm run test         # Run tests
npm run deploy:local # Deploy to local network
```

---

## 🛡️ Security Features

- **Environment Variables**: All sensitive data stored in `.env` files
- **Git Ignore**: `.env` files excluded from version control
- **Input Validation**: Server-side validation for all API endpoints
- **Error Handling**: Comprehensive error handling and logging
- **Secure Transactions**: MetaMask handles all blockchain interactions

---

## 🐛 Troubleshooting

### Common Issues

1. **Audio Recording Not Working**
   - **Use Safari browser** - Chrome/Firefox have limited MediaRecorder support
   - Ensure microphone permissions are granted
   - Check if ElevenLabs API key is configured correctly

2. **Pronunciation Assessment Failing**
   - Verify Azure Speech Services key is set in backend `.env`
   - Ensure you're speaking clearly and loudly
   - Check browser console for detailed error messages

3. **Text-to-Speech Not Working**
   - Verify ElevenLabs API key is configured
   - Check network connectivity
   - Ensure voice ID is set in frontend `.env`

4. **MetaMask Connection Failed**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network (Ethereum)

5. **Token Balance Not Loading**
   - Verify the token contract address is correct
   - Check if you're connected to the right network

6. **Backend Connection Error**
   - Ensure the backend server is running on port 3001
   - Check database connection and credentials

7. **Module Not Found Errors**
   - Run `npm install` in the respective directories
   - Clear node_modules and reinstall if needed

### Environment Variables Debug
```bash
# Check if environment variables are loaded
cd "YAPBackend copy"
node -e "console.log('ElevenLabs Key:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Missing')"
node -e "console.log('Azure Key:', process.env.AZURE_SPEECH_KEY ? 'Set' : 'Missing')"
```

### Audio Debug
- Check `YAPBackend copy/uploads/debug/` for saved audio files
- Review browser console for MediaRecorder errors
- Test microphone permissions in browser settings

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Pond Hackathon** for the opportunity
- **MetaMask** for wallet integration
- **Ethereum Foundation** for blockchain infrastructure
- **OpenZeppelin** for secure smart contract libraries
- **ElevenLabs** for high-quality text-to-speech
- **Azure Speech Services** for pronunciation assessment

---

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Check the troubleshooting section above
- Review the API documentation

**Happy Learning with YAP! 🎓✨** 