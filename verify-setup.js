const fs = require('fs');
const path = require('path');

function verifySetup() {
  console.log('🔍 验证 Core 测试网设置...');

  const requiredFiles = [
    'CORE_TESTNET_SETUP.md',
    'setup-core-testnet.sh',
    'scripts/setup-core-testnet.js',
    'scripts/get-testnet-tokens.js',
    'scripts/verify-testnet-setup.js',
    'yap-token-deployment/package.json',
    'yap-token-deployment/hardhat.config.js',
    'yap-token-deployment/contracts/YAPToken.sol'
  ];

  const requiredDirs = [
    'scripts',
    'yap-token-deployment',
    'yap-frontend-v2',
    'YAPBackend'
  ];

  console.log('📁 检查必需目录...');
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`  ✅ ${dir}/`);
    } else {
      console.log(`  ❌ ${dir}/ (缺失)`);
    }
  });

  console.log('\n📄 检查必需文件...');
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (缺失)`);
      allFilesExist = false;
    }
  });

  // 检查 package.json 中的脚本
  console.log('\n📦 检查 package.json 脚本...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('yap-token-deployment/package.json', 'utf8'));
    const requiredScripts = [
      'setup:coreTestnet',
      'get:tokens',
      'verify:testnet',
      'deploy:coreTestnet',
      'verify:coreTestnet'
    ];

    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`  ✅ ${script}`);
      } else {
        console.log(`  ❌ ${script} (缺失)`);
        allFilesExist = false;
      }
    });
  } catch (error) {
    console.log('  ❌ 无法读取 package.json');
    allFilesExist = false;
  }

  // 检查 hardhat.config.js 中的网络配置
  console.log('\n🌐 检查 Hardhat 配置...');
  try {
    const hardhatConfig = fs.readFileSync('yap-token-deployment/hardhat.config.js', 'utf8');
    
    if (hardhatConfig.includes('coreTestnet')) {
      console.log('  ✅ Core 测试网配置存在');
    } else {
      console.log('  ❌ Core 测试网配置缺失');
      allFilesExist = false;
    }

    if (hardhatConfig.includes('1115')) {
      console.log('  ✅ Chain ID 1115 配置正确');
    } else {
      console.log('  ❌ Chain ID 1115 配置缺失');
      allFilesExist = false;
    }
  } catch (error) {
    console.log('  ❌ 无法读取 hardhat.config.js');
    allFilesExist = false;
  }

  console.log('\n📋 设置验证结果:');
  if (allFilesExist) {
    console.log('🎉 所有文件都已正确设置！');
    console.log('\n📋 下一步:');
    console.log('   1. cd hackathon/yap-token-deployment');
    console.log('   2. npm install');
    console.log('   3. npm run verify:testnet');
    console.log('   4. npm run deploy:coreTestnet');
  } else {
    console.log('⚠️  部分文件缺失，请检查上述错误。');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  verifySetup();
}

module.exports = { verifySetup }; 