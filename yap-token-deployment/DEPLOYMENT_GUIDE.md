# 🚀 YAP Token Deployment Guide

This guide will walk you through deploying your YAP token contract on Ethereum mainnet.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** wallet with ETH for gas fees
3. **Infura API Key** (or other RPC provider)
4. **Etherscan API Key** (for contract verification)

## 🔧 Step 1: Setup Environment

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Create Environment File
Create a `.env` file in the root directory:

```env
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Infura API Key
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 1.3 Get Required API Keys

#### Infura API Key:
1. Go to [Infura.io](https://infura.io)
2. Sign up and create a new project
3. Copy your project ID
4. Replace `YOUR_INFURA_KEY` in the `.env` file

#### Etherscan API Key:
1. Go to [Etherscan.io](https://etherscan.io)
2. Create an account
3. Go to API Keys section
4. Create a new API key
5. Add it to your `.env` file

## 🧪 Step 2: Test Deployment (Recommended)

Before deploying to mainnet, test on a testnet:

### 2.1 Deploy to Sepolia Testnet
```bash
npm run deploy:sepolia
```

### 2.2 Verify Contract on Etherscan
```bash
npm run verify:sepolia
```

### 2.3 Test Token Functions
- Transfer tokens between addresses
- Test minting (if you're the owner)
- Test burning tokens

## 🚀 Step 3: Deploy to Ethereum Mainnet

### 3.1 Ensure You Have Enough ETH
- Check your wallet has at least 0.1 ETH for gas fees
- Mainnet deployment costs ~$50-200 depending on gas prices

### 3.2 Deploy Contract
```bash
npm run deploy:mainnet
```

### 3.3 Save Deployment Info
The script will output important information:
- Contract address
- Deployer address
- Total supply
- Network details

### 3.4 Verify Contract on Etherscan
```bash
npm run verify:mainnet
```

## 🔍 Step 4: Update Your Application

### 4.1 Update Frontend Environment
In your frontend `.env` file:
```env
NEXT_PUBLIC_TOKEN_ADDRESS=your_deployed_contract_address
```

### 4.2 Update Backend Environment
In your backend `.env` file:
```env
YAP_TOKEN_ADDRESS=your_deployed_contract_address
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
```

## 📊 Step 5: Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on Etherscan
- [ ] Token name and symbol correct
- [ ] Total supply as expected
- [ ] Frontend environment updated
- [ ] Backend environment updated
- [ ] Test token transfers
- [ ] Test minting (if needed)
- [ ] Test burning functionality

## 🔧 Step 6: Contract Management

### Minting Tokens (Owner Only)
```javascript
// Using ethers.js
const contract = new ethers.Contract(contractAddress, abi, signer);
const tx = await contract.mint(userAddress, ethers.parseEther("100"));
await tx.wait();
```

### Burning Tokens (Any User)
```javascript
const tx = await contract.burn(ethers.parseEther("10"));
await tx.wait();
```

## ⚠️ Important Security Notes

1. **Never share your private key**
2. **Use environment variables for sensitive data**
3. **Test thoroughly on testnets first**
4. **Keep your private key secure**
5. **Consider using a hardware wallet for mainnet**

## 🆘 Troubleshooting

### Common Issues:

1. **"Insufficient funds"**
   - Add more ETH to your wallet

2. **"Gas estimation failed"**
   - Check your RPC URL is correct
   - Ensure you have enough ETH

3. **"Contract verification failed"**
   - Double-check your Etherscan API key
   - Ensure contract compilation is successful

4. **"Network error"**
   - Check your Infura API key
   - Verify network configuration

## 📞 Support

If you encounter issues:
1. Check the Hardhat documentation
2. Verify your environment variables
3. Ensure you have sufficient ETH for gas fees
4. Test on testnet first

---

**Good luck with your deployment! 🎉** 