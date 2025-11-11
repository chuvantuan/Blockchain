# 🚀 LearnToken Smart Contract Deployment Guide

Complete guide để deploy LearnToken ERC-20 contract lên Sepolia Testnet.

## 📋 Prerequisites

### 1. MetaMask Wallet
- Install MetaMask extension: https://metamask.io
- Create hoặc import wallet
- **QUAN TRỌNG:** Backup seed phrase an toàn!

### 2. Get Sepolia Test ETH
Bạn cần ~0.05 ETH để deploy. Get free từ faucets:

**Top Faucets:**
- https://sepoliafaucet.com (Requires Alchemy account)
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia
- https://sepolia-faucet.pk910.de (PoW Faucet - mine ETH)

**Steps:**
1. Switch MetaMask to Sepolia Testnet
2. Copy your wallet address
3. Paste vào faucet và request
4. Wait 1-5 minutes

### 3. Get API Keys

#### Infura RPC URL (Free)
1. Sign up: https://infura.io
2. Create new project
3. Copy Sepolia endpoint: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

**Alternative:** Alchemy (https://alchemy.com)

#### Etherscan API Key (Free)
1. Sign up: https://etherscan.io
2. Go to: https://etherscan.io/myapikey
3. Create API Key
4. Copy key

## 🛠️ Setup

### 1. Configure Environment

```bash
cd contracts

# Copy .env template
cp .env.example .env
```

### 2. Edit `.env` file

```bash
# .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xyour_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ Get Private Key from MetaMask:**
1. Open MetaMask
2. Click 3 dots → Account Details
3. Export Private Key
4. Enter password
5. **Copy key và thêm prefix `0x` nếu chưa có**

**🔒 SECURITY:**
- ✅ Add `.env` to `.gitignore`
- ❌ NEVER commit private key
- ❌ NEVER share private key
- ❌ NEVER use mainnet wallet private key

### 3. Verify Installation

```bash
# Check Hardhat installed
npx hardhat --version

# Should show: Hardhat version 2.x.x
```

## 🚀 Deployment Steps

### Step 1: Test Compilation

```bash
cd contracts
npx hardhat compile
```

**Expected output:**
```
Compiled 1 Solidity file successfully
```

### Step 2: Test Local Deployment

```bash
# Deploy to local Hardhat network (for testing)
npx hardhat run scripts/deploy.js
```

If successful, proceed to testnet!

### Step 3: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected output:**
```
🚀 Starting LearnToken deployment...
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.05 ETH

⏳ Deploying LearnToken contract...
✅ LearnToken deployed successfully!
📍 Contract address: 0x...
🔗 Deployment tx hash: 0x...

⏳ Waiting for 5 confirmations...
✅ Confirmed!

📊 Contract Information:
   Name: Learn Token
   Symbol: LEARN
   Max Supply: 1000000000 LEARN
   Owner: 0x...

🎁 Reward Rates:
   Complete Lesson: 10 LEARN
   Pass Exam: 50 LEARN
   Daily Streak: 5 LEARN
   Certification: 200 LEARN
   Win Contest: 500 LEARN

🔧 Frontend Configuration:
   1. Copy contract address to frontend .env:
      VITE_LEARN_TOKEN_ADDRESS=0x...

✨ Contract Verification:
   Run this command to verify on Etherscan:
   npx hardhat verify --network sepolia 0x...

🔍 View on Sepolia Etherscan:
   https://sepolia.etherscan.io/address/0x...

💾 Deployment info saved to: deployment-info.json
🎉 Deployment completed successfully!
```

**⏰ Time:** ~2-5 minutes
**💰 Cost:** ~0.01-0.03 ETH (gas fees)

### Step 4: Verify Contract on Etherscan

```bash
npx hardhat run scripts/verify.js --network sepolia
```

**Expected output:**
```
🔍 Verifying LearnToken contract...
📍 Contract address: 0x...
✅ Contract verified successfully!
🔗 View on Etherscan: https://sepolia.etherscan.io/address/0x...#code
```

**Benefits của verification:**
- ✅ Source code visible trên Etherscan
- ✅ Users có thể đọc contract
- ✅ Enable contract interactions trên Etherscan UI
- ✅ Tăng trust và transparency

### Step 5: Update Frontend

**1. Create `.env` in web-frontend root:**

```bash
cd ../  # Back to web-frontend root
```

```env
# .env
VITE_LEARN_TOKEN_ADDRESS=0xYourContractAddress
```

**2. Update `src/services/blockchain/walletService.ts`:**

Find line ~20:
```typescript
const LEARN_TOKEN_ADDRESS = import.meta.env.VITE_LEARN_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000'
```

Or hardcode it:
```typescript
const LEARN_TOKEN_ADDRESS = '0xYourContractAddress'
```

**3. Rebuild frontend:**
```bash
npm run build
```

## 🎮 Testing Contract

### Interactive Testing

```bash
cd contracts
npx hardhat run scripts/interact.js --network sepolia
```

**Menu options:**
1. **Check balance** - View user token balance
2. **Check user stats** - View earned/spent
3. **Authorize minter** - Add backend address
4. **Award test tokens** - Give rewards
5. **Get contract info** - View details
6. **Exit**

### Example: Award Test Tokens

```bash
# Run interact script
npx hardhat run scripts/interact.js --network sepolia

# Choose option 4
Enter choice: 4

# Enter your MetaMask address
Enter user address: 0xYourAddress

# Choose reward type
Choice: 1  # Complete Lesson

✅ Tokens awarded!
```

### View on Etherscan

1. Go to: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
2. Click "Contract" tab
3. Click "Read Contract" - View balances
4. Click "Write Contract" - Manual interactions

## 🔧 Troubleshooting

### Error: "Insufficient balance"
- ✅ Get more test ETH from faucets
- ✅ Check balance: `ethers.provider.getBalance(address)`

### Error: "Invalid API Key"
- ✅ Check SEPOLIA_RPC_URL in `.env`
- ✅ Verify Infura project ID
- ✅ Check no spaces in URL

### Error: "Invalid private key"
- ✅ Add `0x` prefix
- ✅ Check full 64-character hex string
- ✅ Export correct key from MetaMask

### Error: "Transaction failed"
- ✅ Check gas price not too low
- ✅ Network congestion - retry later
- ✅ Check Sepolia RPC working

### Error: "Contract already verified"
- ✅ This is OK! Contract already verified
- ✅ Check Etherscan link

### Verification fails
- ✅ Wait 1-2 minutes after deployment
- ✅ Check ETHERSCAN_API_KEY correct
- ✅ Ensure contract compiled same version

## 📊 Contract Functions

### Owner Functions (Only Owner)
- `authorizeMinter(address)` - Authorize backend to mint
- `revokeMinter(address)` - Remove minter
- `updateRewardRate(string, uint256)` - Change rates
- `pause()` / `unpause()` - Emergency stop

### Minter Functions (Owner + Authorized)
- `rewardCompleteLesson(address)` - 10 LEARN
- `rewardPassExam(address, score)` - 50 LEARN + bonus
- `rewardDailyStreak(address, days)` - 5 LEARN + bonus
- `rewardCertification(address)` - 200 LEARN
- `rewardWinContest(address, rank)` - 500 LEARN + bonus
- `rewardCustom(address, amount, reason)` - Custom
- `spendTokens(address, amount, purpose)` - Burn for purchases

### User Functions (Anyone)
- `requestWithdrawal(amount, bankAccount)` - Withdraw to bank
- `transfer(address, amount)` - Send tokens
- `balanceOf(address)` - Check balance
- `getUserStats(address)` - View statistics

### View Functions (Read-only)
- `name()` - "Learn Token"
- `symbol()` - "LEARN"
- `totalSupply()` - Current supply
- `MAX_SUPPLY()` - 1 billion
- `owner()` - Contract owner
- `paused()` - Pause status

## 🔐 Security Best Practices

### Development
- ✅ Use testnet first
- ✅ Test thoroughly
- ✅ Verify contract
- ✅ Keep private keys secure

### Production (Mainnet)
- ✅ Audit contract code
- ✅ Use hardware wallet
- ✅ Multi-sig for owner
- ✅ Gradual rollout
- ✅ Monitor transactions

## 📝 Next Steps

### Backend Integration
1. **Get contract address** from deployment
2. **Authorize backend address** as minter
3. **Implement API endpoints** to call contract
4. **Setup events listening** for real-time updates
5. **Add error handling** và retry logic

### Frontend Integration
1. **Update contract address** in .env
2. **Test MetaMask connection**
3. **Test token display**
4. **Test reward claiming**
5. **Test withdrawal flow**

### Monitoring
1. **Setup Etherscan alerts**
2. **Monitor gas usage**
3. **Track minting events**
4. **Watch for errors**

## 📚 Resources

**Hardhat:**
- Docs: https://hardhat.org/docs
- Tutorial: https://hardhat.org/tutorial

**OpenZeppelin:**
- Contracts: https://docs.openzeppelin.com/contracts
- ERC20: https://docs.openzeppelin.com/contracts/erc20

**Ethers.js:**
- Docs: https://docs.ethers.org
- Provider: https://docs.ethers.org/v6/api/providers/

**Sepolia:**
- Explorer: https://sepolia.etherscan.io
- Faucets: Listed above
- RPC: https://chainlist.org/?search=sepolia

## ❓ FAQ

**Q: How much ETH needed?**
A: ~0.05 ETH for deployment + verification + testing

**Q: Deploy cost?**
A: ~0.01-0.03 ETH (varies with gas price)

**Q: Can I redeploy?**
A: Yes! Each deploy creates new address

**Q: Lost contract address?**
A: Check `deployment-info.json` or Etherscan transaction history

**Q: Need to update contract?**
A: Deploy new version, migrate users (upgradeable patterns in future)

**Q: When deploy mainnet?**
A: After thorough testnet testing + audit

## 🎉 Success Checklist

- [ ] MetaMask installed và funded
- [ ] `.env` configured correctly
- [ ] Contract compiled successfully
- [ ] Deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Frontend .env updated
- [ ] Tested token minting
- [ ] Tested with MetaMask
- [ ] Backend address authorized
- [ ] Ready for production!

---

**🚀 Ready to deploy? Good luck!**

If you encounter issues, check Troubleshooting section or contact support.

Contract Address (will be here after deployment): `_______________`
