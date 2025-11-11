const hre = require("hardhat");

async function main() {
  // Read deployment info
  const fs = require('fs');

  if (!fs.existsSync('./deployment-info.json')) {
    console.error("❌ deployment-info.json not found!");
    console.log("Deploy contract first using: npx hardhat run scripts/deploy.js --network sepolia");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync('./deployment-info.json', 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  console.log("🔍 Verifying LearnToken contract...");
  console.log("📍 Contract address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // LearnToken has no constructor arguments
    });

    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!");
      console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:");
      console.error(error);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
