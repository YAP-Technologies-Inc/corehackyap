const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying YAP Token...");

  // Get the contract factory
  const YAPToken = await ethers.getContractFactory("YAPToken");
  
  // Deploy the contract
  const yapToken = await YAPToken.deploy();
  
  // Wait for deployment to finish
  await yapToken.waitForDeployment();
  
  const address = await yapToken.getAddress();
  
  console.log("YAP Token deployed to:", address);
  console.log("Contract name:", await yapToken.name());
  console.log("Contract symbol:", await yapToken.symbol());
  console.log("Total supply:", ethers.formatEther(await yapToken.totalSupply()));
  
  // Save deployment info
  const deploymentInfo = {
    network: "ethereum",
    contract: "YAPToken",
    address: address,
    deployer: await yapToken.signer.getAddress(),
    deploymentTime: new Date().toISOString()
  };
  
  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 