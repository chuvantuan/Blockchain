const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting LearnToken deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ Insufficient balance! Get test ETH from faucet first.");
    console.log("\n📍 Sepolia Faucets:");
    console.log("   - https://sepoliafaucet.com");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    process.exit(1);
  }

  // Deploy LearnToken
  console.log("⏳ Deploying LearnToken contract...");
  const LearnToken = await hre.ethers.getContractFactory("LearnToken");
  const learnToken = await LearnToken.deploy();

  await learnToken.waitForDeployment();
  const address = await learnToken.getAddress();

  console.log("✅ LearnToken deployed successfully!");
  console.log("📍 Contract address:", address);

  // Get deployment transaction
  const deployTx = learnToken.deploymentTransaction();
  console.log("🔗 Deployment tx hash:", deployTx?.hash);

  // Wait for confirmations
  console.log("\n⏳ Waiting for 5 confirmations...");
  await deployTx?.wait(5);
  console.log("✅ Confirmed!");

  // Display contract info
  console.log("\n📊 Contract Information:");
  console.log("   Name:", await learnToken.name());
  console.log("   Symbol:", await learnToken.symbol());
  console.log("   Max Supply:", hre.ethers.formatEther(await learnToken.MAX_SUPPLY()), "LEARN");
  console.log("   Owner:", await learnToken.owner());

  // Display reward rates
  console.log("\n🎁 Reward Rates:");
  console.log("   Complete Lesson:", hre.ethers.formatEther(await learnToken.rewardCompleteLesson()), "LEARN");
  console.log("   Pass Exam:", hre.ethers.formatEther(await learnToken.rewardPassExam()), "LEARN");
  console.log("   Daily Streak:", hre.ethers.formatEther(await learnToken.rewardDailyStreak()), "LEARN");
  console.log("   Certification:", hre.ethers.formatEther(await learnToken.rewardCertification()), "LEARN");
  console.log("   Win Contest:", hre.ethers.formatEther(await learnToken.rewardWinContest()), "LEARN");

  // Instructions for frontend
  console.log("\n🔧 Frontend Configuration:");
  console.log("   1. Copy contract address to frontend .env:");
  console.log(`      VITE_LEARN_TOKEN_ADDRESS=${address}`);
  console.log("\n   2. Update walletService.ts with contract address");
  console.log(`      const LEARN_TOKEN_ADDRESS = '${address}'`);

  // Verification instructions
  console.log("\n✨ Contract Verification:");
  console.log("   Run this command to verify on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${address}`);

  // Sepolia Explorer link
  console.log("\n🔍 View on Sepolia Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${address}`);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    deploymentTx: deployTx?.hash,
    timestamp: new Date().toISOString(),
    blockNumber: deployTx?.blockNumber
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to: deployment-info.json");

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
