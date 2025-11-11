const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CopyrightRegistry contract...");

  // Get the contract factory
  const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry");

  // Deploy the contract
  const copyrightRegistry = await CopyrightRegistry.deploy();

  // Wait for deployment to complete
  await copyrightRegistry.waitForDeployment();

  const contractAddress = await copyrightRegistry.getAddress();
  
  console.log("✅ CopyrightRegistry deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Etherscan URL:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await copyrightRegistry.owner();
  const registrationFee = await copyrightRegistry.registrationFee();
  const verificationFee = await copyrightRegistry.verificationFee();
  
  console.log("👤 Owner:", owner);
  console.log("💰 Registration Fee:", ethers.formatEther(registrationFee), "ETH");
  console.log("💰 Verification Fee:", ethers.formatEther(verificationFee), "ETH");
  
  // Get initial statistics
  const [totalDocs, totalVerified, totalOwners, balance] = await copyrightRegistry.getStatistics();
  console.log("\n📊 Initial Statistics:");
  console.log("📄 Total Documents:", totalDocs.toString());
  console.log("✅ Total Verified:", totalVerified.toString());
  console.log("👥 Total Owners:", totalOwners.toString());
  console.log("💰 Contract Balance:", ethers.formatEther(balance), "ETH");

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    owner: owner,
    registrationFee: ethers.formatEther(registrationFee),
    verificationFee: ethers.formatEther(verificationFee),
    etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for frontend integration
  console.log("\n🔧 Frontend Integration:");
  console.log("Add this to your .env file:");
  console.log(`VITE_COPYRIGHT_REGISTRY_ADDRESS=${contractAddress}`);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Copy the contract address to your frontend .env file");
  console.log("2. Update your contract ABI in the frontend");
  console.log("3. Test the contract functions");
  console.log("4. Deploy to mainnet when ready");

  return contractAddress;
}

// Run the deployment
main()
  .then((address) => {
    console.log(`\n🎉 Deployment completed successfully at ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
