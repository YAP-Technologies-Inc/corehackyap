const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const YAP_TOKEN_ADDRESS = process.env.YAP_TOKEN_ADDRESS || '0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c';
const RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/5286e08a82b14a18a4964abb9283808f';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Test recipient address (you can change this to any address)
const TEST_RECIPIENT = '0x1234567890123456789012345678901234567890'; // Replace with actual test address

// YAP Token ABI
const YAP_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

async function transferTokens() {
  try {
    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Create contract instance
    const contract = new ethers.Contract(YAP_TOKEN_ADDRESS, YAP_TOKEN_ABI, wallet);
    
    // Get deployer balance
    const deployerBalance = await contract.balanceOf(wallet.address);
    const decimals = await contract.decimals();
    
    console.log('🔍 Deployer address:', wallet.address);
    console.log('🔍 Deployer balance:', ethers.formatUnits(deployerBalance, decimals), 'YAP');
    
    // Transfer 100 tokens to test address
    const transferAmount = ethers.parseUnits('100', decimals);
    console.log('🔄 Transferring 100 YAP tokens to:', TEST_RECIPIENT);
    
    const tx = await contract.transfer(TEST_RECIPIENT, transferAmount);
    const receipt = await tx.wait();
    
    console.log('✅ Transfer successful!');
    console.log('📝 Transaction hash:', receipt.hash);
    
    // Check new balances
    const newDeployerBalance = await contract.balanceOf(wallet.address);
    const recipientBalance = await contract.balanceOf(TEST_RECIPIENT);
    
    console.log('🔍 New deployer balance:', ethers.formatUnits(newDeployerBalance, decimals), 'YAP');
    console.log('🔍 Recipient balance:', ethers.formatUnits(recipientBalance, decimals), 'YAP');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

transferTokens(); 