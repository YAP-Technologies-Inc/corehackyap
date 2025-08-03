const { ethers } = require('hardhat');
require('dotenv').config();

async function main() {
  console.log('🧪 设置 Core 测试网...');

  // 检查环境变量
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.CORE_TESTNET_RPC_URL || 'https://rpc.test.btcs.network';

  if (!privateKey) {
    console.error('❌ 请在 .env 文件中设置 PRIVATE_KEY');
    process.exit(1);
  }

  try {
    // 初始化提供者
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('🔍 检查网络连接...');
    
    // 检查网络
    const network = await provider.getNetwork();
    console.log('🌐 网络信息:');
    console.log('  Chain ID:', network.chainId.toString());
    console.log('  网络名称:', network.name);
    
    if (network.chainId.toString() !== '1115') {
      console.warn('⚠️  警告: 当前网络 Chain ID 不是 1115 (Core 测试网)');
    }

    // 检查钱包余额
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 钱包信息:');
    console.log('  地址:', wallet.address);
    console.log('  CORE 余额:', ethers.formatEther(balance), 'CORE');

    if (balance === 0n) {
      console.log('\n⚠️  钱包中没有 CORE 代币');
      console.log('💡 请使用以下方法获取测试代币:');
      console.log('   1. 访问: https://faucet.test.btcs.network/');
      console.log('   2. 输入您的钱包地址');
      console.log('   3. 点击 "Request CORE"');
      console.log('   4. 等待几分钟接收代币');
    } else {
      console.log('✅ 钱包中有足够的 CORE 代币');
    }

    // 检查 gas 价格
    const gasPrice = await provider.getFeeData();
    console.log('⛽ Gas 信息:');
    console.log('  当前 Gas 价格:', ethers.formatUnits(gasPrice.gasPrice, 'gwei'), 'gwei');

    console.log('\n✅ Core 测试网设置检查完成！');
    
    if (balance === 0n) {
      console.log('\n📋 下一步:');
      console.log('   1. 获取测试网 CORE 代币');
      console.log('   2. 运行: npm run deploy:coreTestnet');
      console.log('   3. 运行: npm run verify:coreTestnet');
    } else {
      console.log('\n📋 下一步:');
      console.log('   1. 运行: npm run deploy:coreTestnet');
      console.log('   2. 运行: npm run verify:coreTestnet');
      console.log('   3. 测试合约功能');
    }

  } catch (error) {
    console.error('❌ 设置失败:', error.message);
    
    if (error.message.includes('network')) {
      console.log('\n💡 可能的解决方案:');
      console.log('   1. 检查 RPC URL 是否正确');
      console.log('   2. 确保网络连接正常');
      console.log('   3. 检查 .env 文件配置');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 