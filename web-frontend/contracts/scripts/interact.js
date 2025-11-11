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

  console.log("🔗 Connecting to LearnToken contract...");
  console.log("📍 Contract address:", contractAddress);

  // Get contract instance
  const LearnToken = await hre.ethers.getContractFactory("LearnToken");
  const learnToken = LearnToken.attach(contractAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Using account:", signer.address);

  // Display menu
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function showMenu() {
    console.log("\n" + "=".repeat(50));
    console.log("📜 LearnToken Interaction Menu");
    console.log("=".repeat(50));
    console.log("1. Check balance");
    console.log("2. Check user stats");
    console.log("3. Authorize minter");
    console.log("4. Award test tokens");
    console.log("5. Get contract info");
    console.log("6. Exit");
    console.log("=".repeat(50));
  }

  function prompt(question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }

  async function checkBalance() {
    const address = await prompt("Enter address: ");
    const balance = await learnToken.balanceOf(address);
    console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} LEARN`);
  }

  async function checkUserStats() {
    const address = await prompt("Enter address: ");
    const stats = await learnToken.getUserStats(address);
    console.log("\n📊 User Statistics:");
    console.log(`   Balance: ${hre.ethers.formatEther(stats[0])} LEARN`);
    console.log(`   Total Earned: ${hre.ethers.formatEther(stats[1])} LEARN`);
    console.log(`   Total Spent: ${hre.ethers.formatEther(stats[2])} LEARN`);
  }

  async function authorizeMinter() {
    const address = await prompt("Enter minter address: ");
    console.log("⏳ Authorizing minter...");
    const tx = await learnToken.authorizeMinter(address);
    await tx.wait();
    console.log("✅ Minter authorized!");
    console.log(`🔗 Tx hash: ${tx.hash}`);
  }

  async function awardTokens() {
    const address = await prompt("Enter user address: ");
    console.log("\nSelect reward type:");
    console.log("1. Complete Lesson (10 LEARN)");
    console.log("2. Pass Exam (50 LEARN + bonus)");
    console.log("3. Daily Streak (5 LEARN + bonus)");
    console.log("4. Certification (200 LEARN)");
    console.log("5. Win Contest (500 LEARN + rank bonus)");
    console.log("6. Custom amount");

    const choice = await prompt("Choice: ");

    try {
      let tx;
      console.log("⏳ Sending transaction...");

      switch(choice) {
        case "1":
          tx = await learnToken.rewardCompleteLesson(address);
          break;
        case "2":
          const score = await prompt("Enter score (0-100): ");
          tx = await learnToken.rewardPassExam(address, parseInt(score));
          break;
        case "3":
          const days = await prompt("Enter streak days: ");
          tx = await learnToken.rewardDailyStreak(address, parseInt(days));
          break;
        case "4":
          tx = await learnToken.rewardCertification(address);
          break;
        case "5":
          const rank = await prompt("Enter rank (1, 2, 3...): ");
          tx = await learnToken.rewardWinContest(address, parseInt(rank));
          break;
        case "6":
          const amount = await prompt("Enter amount in LEARN: ");
          const reason = await prompt("Enter reason: ");
          tx = await learnToken.rewardCustom(
            address,
            hre.ethers.parseEther(amount),
            reason
          );
          break;
        default:
          console.log("❌ Invalid choice");
          return;
      }

      await tx.wait();
      console.log("✅ Tokens awarded!");
      console.log(`🔗 Tx hash: ${tx.hash}`);
    } catch (error) {
      console.error("❌ Transaction failed:", error.message);
    }
  }

  async function getContractInfo() {
    console.log("\n📊 Contract Information:");
    console.log(`   Name: ${await learnToken.name()}`);
    console.log(`   Symbol: ${await learnToken.symbol()}`);
    console.log(`   Total Supply: ${hre.ethers.formatEther(await learnToken.totalSupply())} LEARN`);
    console.log(`   Max Supply: ${hre.ethers.formatEther(await learnToken.MAX_SUPPLY())} LEARN`);
    console.log(`   Owner: ${await learnToken.owner()}`);
    console.log(`   Paused: ${await learnToken.paused()}`);
  }

  // Main interaction loop
  let running = true;
  while (running) {
    showMenu();
    const choice = await prompt("\nEnter choice: ");

    try {
      switch(choice) {
        case "1":
          await checkBalance();
          break;
        case "2":
          await checkUserStats();
          break;
        case "3":
          await authorizeMinter();
          break;
        case "4":
          await awardTokens();
          break;
        case "5":
          await getContractInfo();
          break;
        case "6":
          running = false;
          console.log("👋 Goodbye!");
          break;
        default:
          console.log("❌ Invalid choice");
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
