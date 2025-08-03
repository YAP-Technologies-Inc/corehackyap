const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 部署 YAP Token 到 Core 区块链...");

  // 获取合约工厂
  const YAPToken = await ethers.getContractFactory("YAPToken");
  
  // 部署合约
  const yapToken = await YAPToken.deploy();
  
  // 等待部署完成
  await yapToken.waitForDeployment();
  
  const address = await yapToken.getAddress();
  
  console.log("✅ YAP Token 已部署到:", address);
  console.log("📝 合约名称:", await yapToken.name());
  console.log("🏷️  合约符号:", await yapToken.symbol());
  console.log("💰 总供应量:", ethers.formatEther(await yapToken.totalSupply()));
  
  // 保存部署信息
  const deploymentInfo = {
    network: "core",
    chainId: 1116,
    contract: "YAPToken",
    address: address,
    deployer: await yapToken.signer.getAddress(),
    deploymentTime: new Date().toISOString(),
    rpcUrl: "https://rpc.coredao.org",
    explorer: "https://scan.coredao.org"
  };
  
  console.log("\n📋 部署信息:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🔗 在 Core 浏览器上查看:");
  console.log(`https://scan.coredao.org/address/${address}`);
  
  console.log("\n⚠️  重要提醒:");
  console.log("1. 保存合约地址:", address);
  console.log("2. 更新前端和后端的环境变量");
  console.log("3. 在 Core 浏览器上验证合约");
  console.log("4. 测试代币功能");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  }); 