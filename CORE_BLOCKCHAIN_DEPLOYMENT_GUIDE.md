# 🚀 YAP Token - Core Blockchain Deployment Guide

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Deployment Summary](#deployment-summary)
- [Network Configuration](#network-configuration)
- [Smart Contract Details](#smart-contract-details)
- [Testing Results](#testing-results)
- [Frontend Integration](#frontend-integration)
- [Backend Integration](#backend-integration)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## 🎯 Project Overview

**YAP Token** has been successfully deployed to the **Core Blockchain Testnet2**. This is a full-stack Web3 application featuring:

- **Smart Contract**: ERC20 token with minting and burning capabilities
- **Frontend**: Next.js application with MetaMask integration
- **Backend**: Node.js API with blockchain interaction
- **Database**: PostgreSQL for application data

## 🎉 Deployment Summary

### ✅ Successfully Deployed
- **Contract Address**: `0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66`
- **Network**: Core Blockchain Testnet2
- **Chain ID**: 1114
- **Token Name**: YAP Token
- **Token Symbol**: YAP
- **Total Supply**: 1,000,000 YAP
- **Deployer**: `0x073F9866fA39E873A13F1D211b38bB42A653955e`

### 🌐 Blockchain Explorer
View the contract on Core Scan:
[https://scan.test2.btcs.network/address/0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66](https://scan.test2.btcs.network/address/0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66)

## 🔧 Network Configuration

### Core Blockchain Testnet2
```
Network Name: Core Blockchain Testnet2
RPC URL: https://rpc.test2.btcs.network
Chain ID: 1114
Currency Symbol: tCORE2
Block Explorer: https://scan.test2.btcs.network
Faucet: https://scan.test2.btcs.network/faucet
```

### MetaMask Setup
1. Open MetaMask
2. Click network selector → "Add Network" → "Add Network Manually"
3. Enter the configuration above
4. Save and switch to Core Testnet2
5. **Get free test tokens**: Visit https://scan.test2.btcs.network/faucet

## 📜 Smart Contract Details

### Contract Features
- **ERC20 Standard**: Full compliance with ERC20 interface
- **Minting**: Owner can mint new tokens
- **Burning**: Users can burn their own tokens
- **Ownership**: Ownable contract with admin functions

### Contract Code
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YAPToken is ERC20, Ownable {
    constructor() ERC20("YAP Token", "YAP") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // 1 million YAP tokens
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
```

### Deployment Configuration
Located in `hackathon/yap-token-deployment/hardhat.config.js`:

```javascript
networks: {
  coreTestnet: {
    url: "https://rpc.test2.btcs.network",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1114,
    gasPrice: 20000000000, // 20 gwei
  }
}
```

## 🧪 Testing Results

All token functions have been successfully tested:

### ✅ Transfer Function
- **Transaction**: `0x887c4e38aa0458de072063dba4010d85f27caf95b9d1f35e9c01f44bffd0f3c0`
- **Amount**: 100 YAP tokens
- **From**: `0x073F9866fA39E873A13F1D211b38bB42A653955e`
- **To**: `0x1234567890123456789012345678901234567890`
- **Status**: ✅ Success
- **Result**: 
  - Deployer balance: 999,900 YAP
  - Recipient balance: 100 YAP

### ✅ Mint Function
- **Transaction**: `0x30f0ac921d35053f35ba4b66877ceed1ea0c88581548e26b7fd476f6da7aa860`
- **Amount**: 1,000 YAP tokens
- **To**: `0x073F9866fA39E873A13F1D211b38bB42A653955e`
- **Status**: ✅ Success
- **Result**: New balance: 1,000,900 YAP

### ✅ Burn Function
- **Transaction**: `0x64562efc0d686f20c114c73da94be302a34c9f56b71460078981282bfd6dda72`
- **Amount**: 500 YAP tokens
- **Status**: ✅ Success
- **Result**: New balance: 1,000,400 YAP

## 📱 Frontend Integration

### Environment Configuration
Create `.env.local` in the `yap-frontend-v2` directory:

```env
NEXT_PUBLIC_TOKEN_ADDRESS=0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66
NEXT_PUBLIC_NETWORK_ID=1114
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=2k1RrkiAltTGNFiT6rL1
```

### Updated ABI Configuration
The frontend ABI has been updated in `src/app/abis/YAPToken.ts`:

```typescript
export const tokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  // ... events and other functions
];

export const coreNetworkConfig = {
  chainId: 1114,
  chainName: "Core Blockchain Testnet2",
  nativeCurrency: {
    name: "CORE",
    symbol: "tCORE2",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.test2.btcs.network"],
  blockExplorerUrls: ["https://scan.test2.btcs.network"],
};
```

### Starting the Frontend
```bash
cd yap-frontend-v2
npm install
npm run dev
```

Access at: [http://localhost:3000](http://localhost:3000)

## 🔧 Backend Integration

### Environment Configuration
The backend `.env` file in `YAPBackend` directory:

```env
PRIVATE_KEY=your_private_key_here
CORE_TESTNET_RPC_URL=https://rpc.test2.btcs.network
NETWORK=coreTestnet
YAP_TOKEN_ADDRESS=0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66
```

### Available Commands
```bash
cd YAPBackend

# Transfer tokens
NETWORK=coreTestnet node transfer-tokens.js transfer

# Mint tokens (owner only)
NETWORK=coreTestnet node transfer-tokens.js mint <address> <amount>

# Burn tokens
NETWORK=coreTestnet node transfer-tokens.js burn <amount>
```

### Starting the Backend
```bash
cd YAPBackend
npm install
npm start
```

Access at: [http://localhost:3001](http://localhost:3001)

## 📊 Project Structure

```
hackathon/
├── yap-token-deployment/          # Smart contract deployment
│   ├── contracts/
│   │   └── YAPToken.sol          # Main contract
│   ├── scripts/                  # Deployment scripts
│   ├── hardhat.config.js         # Network configuration
│   └── package.json              # Dependencies
├── yap-frontend-v2/              # Next.js frontend
│   ├── src/
│   │   ├── app/abis/             # Contract ABIs
│   │   ├── hooks/                # React hooks
│   │   └── components/           # UI components
│   └── package.json
├── YAPBackend/                   # Node.js backend
│   ├── transfer-tokens.js        # Token interaction script
│   ├── index.js                  # Main server
│   └── package.json
└── scripts/                     # Utility scripts
    ├── setup-core-testnet.js
    ├── get-testnet-tokens.js
    └── verify-testnet-setup.js
```

## 🆘 Troubleshooting

### Common Issues

#### 1. "Insufficient funds for gas"
**Solution**: Ensure you have tCORE2 tokens in your wallet
- Visit: https://scan.test2.btcs.network/faucet
- Request tCORE2 tokens for gas fees

#### 2. "Network ID mismatch"
**Solution**: Make sure MetaMask is connected to Core Testnet2
- Chain ID should be: 1114
- RPC URL should be: https://rpc.test2.btcs.network

#### 3. "Contract not found"
**Solution**: Verify contract address and network
- Contract: `0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66`
- Network: Core Testnet2 (Chain ID: 1114)

#### 4. "Module not found" errors
**Solution**: Install dependencies in each directory
```bash
# In yap-token-deployment
npm install

# In yap-frontend-v2  
npm install

# In YAPBackend
npm install --no-workspaces ethers@^6.0.0
```

### Debugging Commands

```bash
# Verify testnet setup
cd yap-token-deployment
npm run verify:testnet

# Check contract deployment
npm run deploy:coreTestnet

# Test backend functionality
cd ../YAPBackend
NETWORK=coreTestnet node transfer-tokens.js transfer
```

## 🚀 Next Steps

### 1. Contract Verification
Verify the contract on Core Scan for public transparency:
```bash
cd yap-token-deployment
npm run verify:coreTestnet
```

### 2. Production Deployment
When ready for mainnet:
1. Update configuration to Core Mainnet (Chain ID: 1116)
2. Get CORE tokens for mainnet gas fees
3. Deploy using: `npm run deploy:core`

### 3. Enhanced Features
Consider adding:
- **Staking mechanism**: Allow users to stake YAP tokens
- **Governance**: Implement DAO features
- **Cross-chain bridge**: Connect to other blockchains
- **DeFi integration**: Add liquidity pools and trading

### 4. Security Audit
Before mainnet deployment:
- Conduct smart contract audit
- Implement additional security measures
- Test with larger token amounts

## 📞 Support

### Resources
- **Core Documentation**: https://docs.coredao.org/
- **Core Discord**: https://discord.gg/coredao
- **Block Explorer**: https://scan.test2.btcs.network
- **Faucet**: https://scan.test2.btcs.network/faucet

### Key Information
- **Contract Address**: `0x4853BA7b0b02F0AE5A3D540A2B9E79CE70C45a66`
- **Network**: Core Blockchain Testnet2
- **Chain ID**: 1114
- **Deployer**: `0x073F9866fA39E873A13F1D211b38bB42A653955e`

---

## 🎉 Congratulations!

Your YAP Token is now successfully running on the Core Blockchain! The deployment includes:

✅ **Smart Contract**: Deployed and tested
✅ **Token Functions**: Transfer, mint, and burn working
✅ **Frontend Integration**: Ready for Core Blockchain
✅ **Backend API**: Configured for token interactions
✅ **Documentation**: Complete setup guide

**Your project is ready for further development and testing!** 🚀