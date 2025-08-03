const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 验证 YAP Token 合约在 Core 区块链上...");

  // 合约地址 (部署后需要更新)
  const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";
  
  if (contractAddress === "YOUR_CONTRACT_ADDRESS_HERE") {
    console.error("❌ 请先更新脚本中的合约地址");
    console.log("📝 请将 YOUR_CONTRACT_ADDRESS_HERE 替换为实际的合约地址");
    process.exit(1);
  }

  try {
    // 验证合约
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      network: "core"
    });
    
    console.log("✅ 合约验证成功!");
    console.log(`🔗 在 Core 浏览器上查看: https://scan.coredao.org/address/${contractAddress}`);
    
  } catch (error) {
    console.error("❌ 合约验证失败:", error.message);
    
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  合约已经验证过了");
    } else {
      console.log("\n🔧 故障排除:");
      console.log("1. 确保合约地址正确");
      console.log("2. 检查 Core 浏览器 API key");
      console.log("3. 确保合约已成功部署");
      console.log("4. 检查网络连接");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 验证失败:", error);
    process.exit(1);
  }); 