const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing CopyrightRegistry contract...");

  // Get contract address from command line argument
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("❌ Please provide contract address as argument");
    console.log("Usage: npx hardhat run scripts/testCopyright.js --network sepolia -- <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("📍 Contract Address:", contractAddress);

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Testing with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Get contract instance
  const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry");
  const copyrightRegistry = CopyrightRegistry.attach(contractAddress);

  try {
    // Test 1: Get contract info
    console.log("\n📋 Contract Information:");
    const owner = await copyrightRegistry.owner();
    const registrationFee = await copyrightRegistry.registrationFee();
    const verificationFee = await copyrightRegistry.verificationFee();
    
    console.log("👤 Owner:", owner);
    console.log("💰 Registration Fee:", ethers.formatEther(registrationFee), "ETH");
    console.log("💰 Verification Fee:", ethers.formatEther(verificationFee), "ETH");

    // Test 2: Get initial statistics
    console.log("\n📊 Initial Statistics:");
    const [totalDocs, totalVerified, totalOwners, balance] = await copyrightRegistry.getStatistics();
    console.log("📄 Total Documents:", totalDocs.toString());
    console.log("✅ Total Verified:", totalVerified.toString());
    console.log("👥 Total Owners:", totalOwners.toString());
    console.log("💰 Contract Balance:", ethers.formatEther(balance), "ETH");

    // Test 3: Register a test document
    console.log("\n📄 Registering test document...");
    
    // Create a test document hash (SHA-256 of "Test Document Content")
    const testContent = "This is a test document for copyright protection";
    const testHash = ethers.keccak256(ethers.toUtf8Bytes(testContent));
    
    console.log("📝 Test content:", testContent);
    console.log("🔐 Document hash:", testHash);
    
    const registrationTx = await copyrightRegistry.registerDocument(
      testHash,
      "Test Research Paper",
      "This is a test research paper for copyright protection demonstration",
      "research",
      ".pdf",
      1024000, // 1MB
      "QmTestIPFSHash123456789",
      ["research", "test", "blockchain"]
    );
    
    console.log("⏳ Waiting for registration transaction...");
    await registrationTx.wait();
    console.log("✅ Document registered successfully!");
    console.log("🔗 Transaction hash:", registrationTx.hash);

    // Test 4: Verify the document exists
    console.log("\n🔍 Verifying document exists...");
    const exists = await copyrightRegistry.documentExists(testHash);
    console.log("📄 Document exists:", exists);

    // Test 5: Get document information
    console.log("\n📋 Document Information:");
    const document = await copyrightRegistry.getDocument(testHash);
    console.log("📝 Title:", document.title);
    console.log("👤 Owner:", document.owner);
    console.log("📂 Category:", document.category);
    console.log("📁 File Extension:", document.fileExtension);
    console.log("📏 File Size:", document.fileSize.toString(), "bytes");
    console.log("⏰ Timestamp:", new Date(Number(document.timestamp) * 1000).toISOString());
    console.log("✅ Verified:", document.isVerified);
    console.log("🟢 Active:", document.isActive);
    console.log("🏷️ Tags:", document.tags.join(", "));

    // Test 6: Verify the document
    console.log("\n✅ Verifying document...");
    const verificationTx = await copyrightRegistry.verifyDocument(testHash);
    console.log("⏳ Waiting for verification transaction...");
    await verificationTx.wait();
    console.log("✅ Document verified successfully!");
    console.log("🔗 Transaction hash:", verificationTx.hash);

    // Test 7: Get updated document information
    console.log("\n📋 Updated Document Information:");
    const updatedDocument = await copyrightRegistry.getDocument(testHash);
    console.log("✅ Verified:", updatedDocument.isVerified);

    // Test 8: Get owner documents
    console.log("\n👤 Owner Documents:");
    const ownerDocs = await copyrightRegistry.getOwnerDocuments(deployer.address);
    console.log("📄 Number of documents:", ownerDocs.length);
    console.log("🔐 Document hashes:", ownerDocs);

    // Test 9: Get category documents
    console.log("\n📂 Category Documents (research):");
    const categoryDocs = await copyrightRegistry.getCategoryDocuments("research");
    console.log("📄 Number of documents:", categoryDocs.length);
    console.log("🔐 Document hashes:", categoryDocs);

    // Test 10: Get final statistics
    console.log("\n📊 Final Statistics:");
    const [finalDocs, finalVerified, finalOwners, finalBalance] = await copyrightRegistry.getStatistics();
    console.log("📄 Total Documents:", finalDocs.toString());
    console.log("✅ Total Verified:", finalVerified.toString());
    console.log("👥 Total Owners:", finalOwners.toString());
    console.log("💰 Contract Balance:", ethers.formatEther(finalBalance), "ETH");

    console.log("\n🎉 All tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✅ Testing completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
