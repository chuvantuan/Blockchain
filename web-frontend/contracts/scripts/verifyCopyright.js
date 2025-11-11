const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying CopyrightRegistry contract...");

  // Get contract address from command line argument or use default
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("❌ Please provide contract address as argument");
    console.log("Usage: npx hardhat run scripts/verifyCopyright.js --network sepolia -- <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("📍 Contract Address:", contractAddress);

  try {
    // Verify the contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // CopyrightRegistry has no constructor arguments
    });

    console.log("✅ Contract verified successfully!");
    console.log("🔗 Etherscan URL:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      console.log("🔗 Etherscan URL:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => {
    console.log("\n🎉 Verification completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
