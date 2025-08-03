const { ethers } = require('ethers');
require('dotenv').config();

// 配置
const YAP_TOKEN_ADDRESS = process.env.YAP_TOKEN_ADDRESS || '0x7873fD9733c68b7d325116D28fAE6ce0A5deE49c';
const CORE_RPC_URL = process.env.CORE_RPC_URL || 'https://rpc.coredao.org';
const CORE_TESTNET_RPC_URL = process.env.CORE_TESTNET_RPC_URL || 'https://rpc.test.btcs.network';
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/5286e08a82b14a18a4964abb9283808f';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NETWORK = process.env.NETWORK || 'core'; // 'core', 'coreTestnet', 'ethereum'

// 测试接收地址 (您可以更改为任何地址)
const TEST_RECIPIENT = '0x1234567890123456789012345678901234567890'; // 替换为实际测试地址

// YAP Token ABI
const YAP_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  'function owner() view returns (address)',
];

// 网络配置
const NETWORK_CONFIG = {
  core: {
    name: 'Core Mainnet',
    rpcUrl: CORE_RPC_URL,
    chainId: 1116,
    explorer: 'https://scan.coredao.org'
  },
  coreTestnet: {
    name: 'Core Testnet',
    rpcUrl: CORE_TESTNET_RPC_URL,
    chainId: 1115,
    explorer: 'https://scan.test.btcs.network'
  },
  ethereum: {
    name: 'Ethereum Sepolia',
    rpcUrl: ETHEREUM_RPC_URL,
    chainId: 11155111,
    explorer: 'https://sepolia.etherscan.io'
  }
};

async function transferTokens() {
  try {
    const networkConfig = NETWORK_CONFIG[NETWORK];
    if (!networkConfig) {
      throw new Error(`不支持的网络: ${NETWORK}`);
    }

    console.log(`🚀 在 ${networkConfig.name} 上转移代币...`);
    console.log(`🔗 RPC URL: ${networkConfig.rpcUrl}`);

    // 初始化提供者和钱包
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // 创建合约实例
    const contract = new ethers.Contract(YAP_TOKEN_ADDRESS, YAP_TOKEN_ABI, wallet);
    
    // 获取部署者余额
    const deployerBalance = await contract.balanceOf(wallet.address);
    const decimals = await contract.decimals();
    
    console.log('🔍 部署者地址:', wallet.address);
    console.log('🔍 部署者余额:', ethers.formatUnits(deployerBalance, decimals), 'YAP');
    
    // 检查网络连接
    const network = await provider.getNetwork();
    console.log('🌐 当前网络 Chain ID:', network.chainId.toString());
    
    if (network.chainId.toString() !== networkConfig.chainId.toString()) {
      console.warn(`⚠️  警告: 当前网络 Chain ID (${network.chainId}) 与配置的网络 (${networkConfig.chainId}) 不匹配`);
    }
    
    // 转移 100 个代币到测试地址
    const transferAmount = ethers.parseUnits('100', decimals);
    console.log('🔄 转移 100 YAP 代币到:', TEST_RECIPIENT);
    
    const tx = await contract.transfer(TEST_RECIPIENT, transferAmount);
    console.log('📝 交易哈希:', tx.hash);
    
    const receipt = await tx.wait();
    
    console.log('✅ 转移成功!');
    console.log('📝 交易哈希:', receipt.hash);
    console.log(`🔗 在浏览器中查看: ${networkConfig.explorer}/tx/${receipt.hash}`);
    
    // 检查新余额
    const newDeployerBalance = await contract.balanceOf(wallet.address);
    const recipientBalance = await contract.balanceOf(TEST_RECIPIENT);
    
    console.log('🔍 新部署者余额:', ethers.formatUnits(newDeployerBalance, decimals), 'YAP');
    console.log('🔍 接收者余额:', ethers.formatUnits(recipientBalance, decimals), 'YAP');
    
  } catch (error) {
    console.error('❌ 错误:', error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.log('💡 提示: 请确保钱包中有足够的 CORE 代币支付 gas 费用');
    } else if (error.code === 'NETWORK_ERROR') {
      console.log('💡 提示: 请检查 RPC URL 是否正确');
    } else if (error.message.includes('nonce')) {
      console.log('💡 提示: 请等待之前的交易确认或增加 nonce');
    }
  }
}

// 铸造代币函数 (仅所有者)
async function mintTokens(toAddress, amount = '1000') {
  try {
    const networkConfig = NETWORK_CONFIG[NETWORK];
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(YAP_TOKEN_ADDRESS, YAP_TOKEN_ABI, wallet);
    
    const decimals = await contract.decimals();
    const mintAmount = ethers.parseUnits(amount, decimals);
    
    console.log(`🪙 铸造 ${amount} YAP 代币给: ${toAddress}`);
    
    const tx = await contract.mint(toAddress, mintAmount);
    const receipt = await tx.wait();
    
    console.log('✅ 铸造成功!');
    console.log('📝 交易哈希:', receipt.hash);
    
    const newBalance = await contract.balanceOf(toAddress);
    console.log('🔍 新余额:', ethers.formatUnits(newBalance, decimals), 'YAP');
    
  } catch (error) {
    console.error('❌ 铸造失败:', error);
  }
}

// 销毁代币函数
async function burnTokens(amount = '10') {
  try {
    const networkConfig = NETWORK_CONFIG[NETWORK];
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(YAP_TOKEN_ADDRESS, YAP_TOKEN_ABI, wallet);
    
    const decimals = await contract.decimals();
    const burnAmount = ethers.parseUnits(amount, decimals);
    
    console.log(`🔥 销毁 ${amount} YAP 代币`);
    
    const tx = await contract.burn(burnAmount);
    const receipt = await tx.wait();
    
    console.log('✅ 销毁成功!');
    console.log('📝 交易哈希:', receipt.hash);
    
    const newBalance = await contract.balanceOf(wallet.address);
    console.log('🔍 新余额:', ethers.formatUnits(newBalance, decimals), 'YAP');
    
  } catch (error) {
    console.error('❌ 销毁失败:', error);
  }
}

// 主函数
async function main() {
  const command = process.argv[2] || 'transfer';
  
  switch (command) {
    case 'transfer':
      await transferTokens();
      break;
    case 'mint':
      const toAddress = process.argv[3];
      const mintAmount = process.argv[4] || '1000';
      if (!toAddress) {
        console.error('❌ 请提供接收地址: node transfer-tokens.js mint <address> [amount]');
        return;
      }
      await mintTokens(toAddress, mintAmount);
      break;
    case 'burn':
      const burnAmount = process.argv[3] || '10';
      await burnTokens(burnAmount);
      break;
    default:
      console.log('📋 可用命令:');
      console.log('  node transfer-tokens.js transfer  # 转移代币');
      console.log('  node transfer-tokens.js mint <address> [amount]  # 铸造代币');
      console.log('  node transfer-tokens.js burn [amount]  # 销毁代币');
  }
}

main(); 