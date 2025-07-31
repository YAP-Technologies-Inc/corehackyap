# YAP Token System - Pond Hackathon

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-orange?style=for-the-badge&logo=ethereum)](https://ethereum.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A complete Web3 language learning application with token rewards and consumption system built for the Pond Hackathon. Earn YAP tokens by completing Spanish lessons and spend them on AI-powered language learning features.

## 🚀 Features

### 🪙 YAP Token System
- **Token Rewards**: Students earn YAP tokens upon completing lessons
- **Token Consumption**: AI conversational features consume YAP tokens
- **Ethereum Integration**: Deployed on Sepolia testnet with smart contracts
- **Real-time Balance**: Live token balance updates via MetaMask

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
- **Spanish Teacher AI** - Personalized AI conversation partner

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
git clone https://github.com/YAP-Technologies-Inc/pondhackathon.git
cd pondhackathon
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
git clone https://github.com/YAP-Technologies-Inc/pondhackathon.git
cd pondhackathon
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

# Blockchain Configuration
YAP_TOKEN_ADDRESS=0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Azure Speech Services (Required for pronunciation assessment)
AZURE_SPEECH_KEY=your_azure_speech_key

# ElevenLabs API (Required for text-to-speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

#### Frontend Environment (`yap-frontend-v2/.env`)
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
3. Add the key to `YAPBackend/.env` as `ELEVENLABS_API_KEY`

#### Azure Speech Services Key
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a Speech Service resource
3. Get your subscription key and region
4. Add the key to `YAPBackend/.env` as `AZURE_SPEECH_KEY`

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