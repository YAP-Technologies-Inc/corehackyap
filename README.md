# YAP Token System - Core Connect Global Buildathon

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Core Blockchain](https://img.shields.io/badge/Core-Blockchain-orange?style=for-the-badge&logo=blockchain)](https://coredao.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A complete Web3 language learning application with token rewards and consumption system built for the Core Connect Global Buildathon. Earn YAP tokens by completing Spanish lessons and spend them on AI-powered language learning features. Now deployed on Core Blockchain!

## 🎯 **Quick Setup Guide**

**🚀 Ready to Run in 4 Steps:**
```bash
git clone https://github.com/YAP-Technologies-Inc/corehackyap.git
cd corehackyap/hackathon
cp env.example .env
# Edit .env with your API keys (see below)
docker-compose up --build -d
```

**✅ What You Get:**
- Pre-configured Core Blockchain testnet connection
- Deployed YAP Token contract ready to use: `0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66`
- Complete database setup
- Full stack application

## 🚀 Features

### 🪙 YAP Token System
- **Token Rewards**: Students earn YAP tokens upon completing lessons
- **Token Consumption**: AI conversational features consume YAP tokens
- **Core Blockchain Integration**: Deployed on Core Testnet2 with smart contracts
- **Real-time Balance**: Live token balance updates via MetaMask
- **Free Testnet Tokens**: Get tCORE2 from https://scan.test2.btcs.network/faucet

### 🔗 MetaMask Wallet Integration
- Seamless MetaMask wallet connection
- Automatic network switching to Core Blockchain
- Real-time YAP token and CORE balance display
- Secure transaction handling on Core network

### 🎓 Language Learning Platform
- Spanish language lessons with interactive content
- Progress tracking and statistics
- Daily learning streaks
- **Pronunciation assessment with Azure Speech Services**
- **High-quality text-to-speech with ElevenLabs**
- **Spanish Teacher AI** - Personalized AI conversation partner

### 🏗️ Technical Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Node.js, Express, PostgreSQL
- **Blockchain**: Core Blockchain Testnet2, ethers.js
- **Smart Contracts**: Solidity, Hardhat deployment
- **AI Services**: Azure Speech Services, ElevenLabs TTS
- **Network**: Core Testnet2 (Chain ID: 1114)

---

## 📁 Project Structure

```
yap-integration-main/
├── yap-frontend-v2/               # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js app router pages
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── home/             # Dashboard page
│   │   │   ├── lesson/           # Lesson pages
│   │   │   ├── profile/          # User profile
│   │   │   └── spanish-teacher/  # AI teacher feature
│   │   ├── components/            # React components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   ├── lesson/           # Lesson components
│   │   │   ├── wallet/           # MetaMask integration
│   │   │   └── ui/               # UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # React context providers
│   │   ├── assets/               # Static assets
│   │   ├── icons/                # SVG icons
│   │   └── mock/                 # Mock data
│   └── public/                   # Static assets
├── YAPBackend/                   # Node.js backend server
│   ├── index.js                  # Main server file
│   ├── azurePronunciation.js     # Azure Speech Services integration
│   ├── test-elevenlabs.js        # ElevenLabs testing
│   └── uploads/                  # File uploads directory
└── yap-token-deployment/         # Smart contract deployment
    ├── contracts/                # Solidity contracts
    ├── artifacts/                # Compiled contracts
    └── hardhat.config.js         # Hardhat configuration
```

---

## 🛠️ Quick Start

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- **Docker** and **Docker Compose**
- **Chrome Browser** (recommended for easy MetaMask integration)
- **Safari Browser** (supported for audio recording functionality)
- **MetaMask browser extension**
- **Infura API key** (for Ethereum RPC)
- **ElevenLabs API key** (for text-to-speech)
- **Azure Speech Services key** (for pronunciation assessment)

#### 1. Clone Repository
```bash
git clone https://github.com/YAP-Technologies-Inc/corehackyap.git
cd corehackyap/hackathon
```

#### 2. Configure Environment
```bash
# Copy example environment file
cp env.example .env

# Edit .env file with your API keys
nano .env
```

#### 3. Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### Option 2: Manual Setup

#### Prerequisites
- **Node.js 18+** 
- **Chrome Browser** (recommended for easy MetaMask integration)
- **Safari Browser** (supported for audio recording functionality)
- **MetaMask browser extension**
- **PostgreSQL database**
- **Infura API key** (for Ethereum RPC)
- **Etherscan API key** (for contract verification)
- **ElevenLabs API key** (for text-to-speech)
- **Azure Speech Services key** (for pronunciation assessment)

### 1. Clone Repository
```bash
git clone https://github.com/YAP-Technologies-Inc/corehackyap.git
cd corehackyap/hackathon
```

### 2. Install Dependencies

#### Backend
```bash
cd YAPBackend
npm install
```

#### Frontend
```bash
cd yap-frontend-v2
npm install
```

#### Smart Contracts
```bash
cd yap-token-deployment
npm install
```

### 3. Environment Configuration

Create `.env` files in the respective directories:

#### Backend Environment (`YAPBackend/.env`)
```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=yapdb
DB_PASSWORD=your_password
DB_PORT=5432

# Core Blockchain Configuration
YAP_TOKEN_ADDRESS=0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66
CORE_TESTNET_RPC_URL=https://rpc.test2.btcs.network
PRIVATE_KEY=your_private_key_without_0x
NETWORK=coreTestnet

# Azure Speech Services (Required for pronunciation assessment)
AZURE_SPEECH_KEY=your_azure_speech_key

# ElevenLabs API (Required for text-to-speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

#### Frontend Environment (`yap-frontend-v2/.env.local`)
```env
# Core Blockchain Token Contract Address
NEXT_PUBLIC_TOKEN_ADDRESS=0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66
NEXT_PUBLIC_NETWORK_ID=1114

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# ElevenLabs Voice ID (Required for consistent TTS voice)
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=2k1RrkiAltTGNFiT6rL1
```

### 4. API Keys Setup

## 🌐 Core Testnet2 Resources

### Core Testnet2 Faucet

- **Official Faucet**: https://scan.test2.btcs.network/faucet
- **Token**: tCORE2 (for gas fees)
- **Chain ID**: 1114
- **Network**: Core Blockchain Testnet2



#### Polygon Mumbai Testnet
- **Official Faucet**: https://faucet.polygon.technology/
- **Alternative**: https://mumbaifaucet.com/

#### Binance Smart Chain Testnet
- **Official Faucet**: https://testnet.binance.org/faucet-smart

### Testnet Configuration

#### Core Blockchain Testnet2 (Current Deployment)
```
Network Name: Core Blockchain Testnet2
RPC URL: https://rpc.test2.btcs.network
Chain ID: 1114
Currency Symbol: tCORE2
Block Explorer: https://scan.test2.btcs.network/
Faucet: https://scan.test2.btcs.network/faucet
```





### How to Get Testnet Tokens

1. **Connect MetaMask** to your browser
2. **Switch to Core Testnet2** (Chain ID: 1114)
3. **Visit the Core Testnet2 faucet**: https://scan.test2.btcs.network/faucet
4. **Enter your wallet address**
5. **Wait for tokens** to arrive (usually within minutes)

### ⚠️ Important Notes
- Testnet tokens have **no real value**
- They are **only for development and testing**
- **Never send testnet tokens to mainnet addresses**
- Faucets may have daily limits
- Keep your testnet tokens for development purposes

### 5. Database Setup

#### Create Database
```sql
CREATE DATABASE yapdb;
```

#### Complete Schema Setup
Set up the complete database schema in your PostgreSQL database:

```sql
-- Create users table
CREATE TABLE users (
    user_id VARCHAR(42) PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE,
    name VARCHAR(255)
);

-- Create lessons table
CREATE TABLE user_lessons (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(42) REFERENCES users(user_id),
    lesson_id VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tokens_earned INTEGER DEFAULT 1,
    UNIQUE(user_id, lesson_id)
);
```

**Note**: This project uses a simple, static database schema. The tables are designed to be created once with the correct structure from the beginning, ensuring consistency and avoiding migration complexity.

### 6. Run the Application

#### Start Backend
```bash
cd YAPBackend
npm start
```
Backend runs on: http://localhost:3001

#### Start Frontend
```bash
cd yap-frontend-v2
npm run dev
```
Frontend runs on: http://localhost:3000

**⚠️ Browser Recommendations**: 
- **Chrome**: Recommended for easy MetaMask integration and overall experience
- **Safari**: Supported for audio recording functionality, but MetaMask integration may require additional steps

---

## 🐳 Docker Commands

### Development
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Production
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production services
docker-compose -f docker-compose.yml up -d

# Stop all services
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Troubleshooting
```bash
# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose up --build backend

# Access database
docker-compose exec postgres psql -U postgres -d yapdb

# View container logs
docker logs yap-backend
docker logs yap-frontend
```

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
PRIVATE_KEY=your_metamask_private_key_without_0x
CORE_TESTNET_RPC_URL=https://rpc.test2.btcs.network
NETWORK=coreTestnet
```

4. **Get testnet tokens**:
Visit https://scan.test2.btcs.network/faucet to get free tCORE2 tokens for gas fees.

5. **Compile contracts**:
```bash
npm run compile
```

6. **Deploy to Core Testnet2**:
```bash
npm run deploy:coreTestnet
```

7. **Verify testnet setup**:
```bash
npm run verify:testnet
```

### Contract Details (Current Deployment)
- **Token Name**: YAP Token
- **Token Symbol**: YAP
- **Total Supply**: 1,000,000 YAP
- **Network**: Core Blockchain Testnet2
- **Chain ID**: 1114
- **Contract Address**: `0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66`
- **Block Explorer**: [View Contract](https://scan.test2.btcs.network/address/0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66)
- **Faucet**: https://scan.test2.btcs.network/faucet

### Testing Token Functions
```bash
cd ../YAPBackend

# Transfer tokens
NETWORK=coreTestnet node transfer-tokens.js transfer

# Mint tokens (owner only)
NETWORK=coreTestnet node transfer-tokens.js mint <address> <amount>

# Burn tokens
NETWORK=coreTestnet node transfer-tokens.js burn <amount>
```

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
1. **Use Chrome or Safari browser** for audio recording experience
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
cd yap-frontend-v2
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
```

### Backend Development
```bash
cd YAPBackend
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
   - **Use Chrome or Safari browser** - Both support MediaRecorder API
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
   - Check if you're on the correct network (Core Testnet2 - Chain ID: 1114)
   - Add Core Testnet2 to MetaMask if needed

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
cd YAPBackend
node -e "console.log('ElevenLabs Key:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Missing')"
node -e "console.log('Azure Key:', process.env.AZURE_SPEECH_KEY ? 'Set' : 'Missing')"
```

### Audio Debug
- Check `YAPBackend/uploads/debug/` for saved audio files
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

- **Core Connect Global Buildathon** for the opportunity
- **Core Foundation** for Core Blockchain infrastructure
- **MetaMask** for wallet integration
- **OpenZeppelin** for secure smart contract libraries
- **ElevenLabs** for high-quality text-to-speech
- **Azure Speech Services** for pronunciation assessment
- **Core Testnet Faucet** (https://scan.test2.btcs.network/faucet) for free test tokens

---

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Check the troubleshooting section above
- Review the API documentation

**Happy Learning with YAP! 🎓✨** 
