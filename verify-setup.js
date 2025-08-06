const fs = require('fs');
const path = require('path');

function verifySetup() {
  console.log('🔍 Verifying Core testnet setup...');

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

  console.log('📁 Checking required directories...');
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`  ✅ ${dir}/`);
    } else {
              console.log(`  ❌ ${dir}/ (missing)`);
    }
  });

  console.log('\n📄 Checking required files...');
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
              console.log(`  ❌ ${file} (missing)`);
      allFilesExist = false;
    }
  });

  // Check package.json scripts
  console.log('\n📦 Checking package.json scripts...');
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
        console.log(`  ❌ ${script} (missing)`);
        allFilesExist = false;
      }
    });
  } catch (error) {
          console.log('  ❌ Cannot read package.json');
    allFilesExist = false;
  }

  // Check hardhat.config.js network configuration
  console.log('\n🌐 Checking Hardhat configuration...');
  try {
    const hardhatConfig = fs.readFileSync('yap-token-deployment/hardhat.config.js', 'utf8');
    
    if (hardhatConfig.includes('coreTestnet')) {
              console.log('  ✅ Core testnet configuration exists');
    } else {
              console.log('  ❌ Core testnet configuration missing');
      allFilesExist = false;
    }

    if (hardhatConfig.includes('1115')) {
              console.log('  ✅ Chain ID 1114 configured correctly');
    } else {
              console.log('  ❌ Chain ID 1114 configuration missing');
      allFilesExist = false;
    }
  } catch (error) {
          console.log('  ❌ Cannot read hardhat.config.js');
    allFilesExist = false;
  }

  console.log('\n📋 Setup verification results:');
  if (allFilesExist) {
          console.log('🎉 All files are correctly set up!');
      console.log('\n📋 Next steps:');
    console.log('   1. cd hackathon/yap-token-deployment');
    console.log('   2. npm install');
    console.log('   3. npm run verify:testnet');
    console.log('   4. npm run deploy:coreTestnet');
  } else {
          console.log('⚠️  Some files are missing, please check the errors above.');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  verifySetup();
}

module.exports = { verifySetup }; 