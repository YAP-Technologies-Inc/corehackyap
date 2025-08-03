const fetch = require('node-fetch');
require('dotenv').config();

async function requestTestnetTokens() {
  console.log('🪙 请求 Core 测试网代币...');

  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.CORE_TESTNET_RPC_URL || 'https://rpc.test.btcs.network';

  if (!privateKey) {
    console.error('❌ 请在 .env 文件中设置 PRIVATE_KEY');
    process.exit(1);
  }

  try {
    // 从私钥获取钱包地址
    const { ethers } = require('hardhat');
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;

    console.log('🔍 钱包地址:', address);
    console.log('🌐 使用水龙头: https://faucet.test.btcs.network/');

    // 方法 1: 使用 API 请求代币
    console.log('\n📡 尝试通过 API 请求代币...');
    
    try {
      const response = await fetch('https://faucet.test.btcs.network/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ API 请求成功:', result);
        console.log('⏳ 请等待几分钟，代币将自动发送到您的钱包');
      } else {
        console.log('⚠️  API 请求失败:', result);
        console.log('💡 请手动访问水龙头网站');
      }
    } catch (apiError) {
      console.log('⚠️  API 请求失败，请手动获取代币');
    }

    // 方法 2: 提供手动获取的说明
    console.log('\n📋 手动获取代币的方法:');
    console.log('   1. 访问: https://faucet.test.btcs.network/');
    console.log('   2. 输入您的钱包地址:', address);
    console.log('   3. 点击 "Request CORE"');
    console.log('   4. 等待几分钟接收代币');
    
    console.log('\n📋 Discord 获取方法:');
    console.log('   1. 加入 Core Discord: https://discord.gg/core');
    console.log('   2. 在 #testnet-faucet 频道中使用命令:');
    console.log('      !faucet', address);

    // 检查当前余额
    console.log('\n🔍 检查当前余额...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    
    console.log('💰 当前 CORE 余额:', ethers.formatEther(balance), 'CORE');
    
    if (balance > 0n) {
      console.log('✅ 钱包中已有 CORE 代币');
    } else {
      console.log('⚠️  钱包中没有 CORE 代币，请使用上述方法获取');
    }

    console.log('\n📋 获取代币后的下一步:');
    console.log('   1. 运行: npm run deploy:coreTestnet');
    console.log('   2. 运行: npm run verify:coreTestnet');
    console.log('   3. 测试合约功能');

  } catch (error) {
    console.error('❌ 获取代币失败:', error.message);
    
    console.log('\n💡 手动获取代币:');
    console.log('   1. 访问: https://faucet.test.btcs.network/');
    console.log('   2. 输入您的钱包地址');
    console.log('   3. 点击 "Request CORE"');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  requestTestnetTokens()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { requestTestnetTokens }; 