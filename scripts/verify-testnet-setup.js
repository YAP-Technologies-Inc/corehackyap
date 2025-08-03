const { ethers } = require('hardhat');
require('dotenv').config();

async function verifyTestnetSetup() {
  console.log('🔍 验证 Core 测试网设置...');

  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.CORE_TESTNET_RPC_URL || 'https://rpc.test2.btcs.network';

  if (!privateKey) {
    console.error('❌ 请在 .env 文件中设置 PRIVATE_KEY');
    console.log('💡 请确保您在 yap-token-deployment 目录中运行此脚本');
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
    
    // 验证 Chain ID
    if (network.chainId.toString() === '1114') {
      console.log('✅ Chain ID 正确 (1114 - Core Testnet2)');
    } else {
      console.log('❌ Chain ID 不正确，应该是 1114');
      console.log('💡 请确保 MetaMask 已切换到 Core Testnet2');
    }

    // 检查钱包余额
    const balance = await provider.getBalance(wallet.address);
    console.log('\n💰 钱包信息:');
    console.log('  地址:', wallet.address);
    console.log('  CORE 余额:', ethers.formatEther(balance), 'CORE');

    if (balance > 0n) {
      console.log('✅ 钱包中有 CORE 代币，可以部署合约');
    } else {
      console.log('⚠️  钱包中没有 CORE 代币');
      console.log('💡 请访问 https://faucet.test.btcs.network/ 获取测试代币');
    }

    // 检查 gas 价格
    const gasPrice = await provider.getFeeData();
    console.log('\n⛽ Gas 信息:');
    console.log('  当前 Gas 价格:', ethers.formatUnits(gasPrice.gasPrice, 'gwei'), 'gwei');

    // 测试网络连接
    console.log('\n🔍 测试网络连接...');
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log('✅ 网络连接正常，当前区块:', blockNumber);
    } catch (error) {
      console.log('❌ 网络连接失败:', error.message);
    }

    // 检查环境变量
    console.log('\n⚙️  环境变量检查:');
    console.log('  PRIVATE_KEY:', privateKey ? '✅ 已设置' : '❌ 未设置');
    console.log('  CORE_TESTNET_RPC_URL:', rpcUrl);
    console.log('  NETWORK:', process.env.NETWORK || '未设置');

    // 总结
    console.log('\n📋 设置验证结果:');
    
    const checks = [
      { name: '网络连接', passed: network.chainId.toString() === '1114' },
      { name: '钱包余额', passed: balance > 0n },
      { name: '私钥配置', passed: !!privateKey },
      { name: 'RPC URL', passed: rpcUrl.includes('test.btcs.network') }
    ];

    checks.forEach(check => {
      console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
    });

    const allPassed = checks.every(check => check.passed);
    
    if (allPassed) {
      console.log('\n🎉 所有检查都通过！您的 Core 测试网设置正确。');
      console.log('\n📋 下一步:');
      console.log('   1. 运行: npm run deploy:coreTestnet');
      console.log('   2. 运行: npm run verify:coreTestnet');
      console.log('   3. 测试合约功能');
    } else {
      console.log('\n⚠️  部分检查未通过，请解决上述问题后重试。');
    }

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    
    if (error.message.includes('network')) {
      console.log('\n💡 可能的解决方案:');
      console.log('   1. 检查 RPC URL 是否正确');
      console.log('   2. 确保网络连接正常');
      console.log('   3. 检查 MetaMask 网络设置');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  verifyTestnetSetup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { verifyTestnetSetup }; 