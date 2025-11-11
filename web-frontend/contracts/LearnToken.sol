// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LearnToken
 * @dev ERC20 Token for educational platform rewards
 */
contract LearnToken is ERC20, Ownable, Pausable {
    // Token configuration
    uint8 private constant _decimals = 18;
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens

    // Reward rates (tokens per action)
    uint256 public rewardCompleteLesson = 10 * 10**18;
    uint256 public rewardPassExam = 50 * 10**18;
    uint256 public rewardDailyStreak = 5 * 10**18;
    uint256 public rewardCertification = 200 * 10**18;
    uint256 public rewardWinContest = 500 * 10**18;

    // Authorized minters (backend services)
    mapping(address => bool) public authorizedMinters;

    // User activity tracking
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public totalSpent;

    // Events
    event RewardIssued(address indexed user, uint256 amount, string reason);
    event TokensSpent(address indexed user, uint256 amount, string purpose);
    event TokensWithdrawn(address indexed user, uint256 amount, string bankAccount);
    event RewardRateUpdated(string rewardType, uint256 newRate);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);

    constructor() ERC20("Learn Token", "LEARN") Ownable(msg.sender) {
        // Mint initial supply to owner
        _mint(msg.sender, 10000000 * 10**18); // 10 million for initial distribution
    }

    /**
     * @dev Modifier to check if caller is authorized minter
     */
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }

    /**
     * @dev Award tokens for completing a lesson
     */
    function rewardCompleteLesson(address user) external onlyMinter whenNotPaused {
        _mintReward(user, rewardCompleteLesson, "Hoan thanh bai hoc");
    }

    /**
     * @dev Award tokens for passing an exam
     */
    function rewardPassExam(address user, uint256 score) external onlyMinter whenNotPaused {
        // Bonus for high scores
        uint256 bonus = (score >= 90) ? rewardPassExam / 2 : 0;
        uint256 amount = rewardPassExam + bonus;
        _mintReward(user, amount, "Vuot qua ky thi");
    }

    /**
     * @dev Award tokens for daily streak
     */
    function rewardDailyStreak(address user, uint256 streakDays) external onlyMinter whenNotPaused {
        // Bonus for long streaks
        uint256 streakBonus = (streakDays / 7) * (2 * 10**18); // 2 tokens per week
        uint256 amount = rewardDailyStreak + streakBonus;
        _mintReward(user, amount, "Chuoi ngay hoc tap");
    }

    /**
     * @dev Award tokens for earning certification
     */
    function rewardCertification(address user) external onlyMinter whenNotPaused {
        _mintReward(user, rewardCertification, "Dat chung chi");
    }

    /**
     * @dev Award tokens for winning contest
     */
    function rewardWinContest(address user, uint256 rank) external onlyMinter whenNotPaused {
        uint256 amount = rewardWinContest;
        if (rank == 1) amount = amount * 2; // Double for 1st place
        else if (rank == 2) amount = amount * 3 / 2; // 1.5x for 2nd place
        _mintReward(user, amount, "Thang cuoc thi");
    }

    /**
     * @dev Custom reward with specific amount and reason
     */
    function rewardCustom(address user, uint256 amount, string memory reason)
        external onlyMinter whenNotPaused {
        _mintReward(user, amount, reason);
    }

    /**
     * @dev Internal function to mint reward tokens
     */
    function _mintReward(address user, uint256 amount, string memory reason) internal {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(user, amount);
        totalEarned[user] += amount;
        emit RewardIssued(user, amount, reason);
    }

    /**
     * @dev Spend tokens for in-app purchases (courses, gifts, etc.)
     */
    function spendTokens(address user, uint256 amount, string memory purpose)
        external onlyMinter whenNotPaused {
        require(balanceOf(user) >= amount, "Insufficient balance");
        _burn(user, amount);
        totalSpent[user] += amount;
        emit TokensSpent(user, amount, purpose);
    }

    /**
     * @dev Request withdrawal to bank account (handled off-chain)
     */
    function requestWithdrawal(uint256 amount, string memory bankAccount)
        external whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(amount >= 100 * 10**18, "Minimum withdrawal is 100 tokens");

        _burn(msg.sender, amount);
        totalSpent[msg.sender] += amount;
        emit TokensWithdrawn(msg.sender, amount, bankAccount);
    }

    /**
     * @dev Update reward rates (only owner)
     */
    function updateRewardRate(string memory rewardType, uint256 newRate)
        external onlyOwner {
        if (keccak256(bytes(rewardType)) == keccak256(bytes("lesson"))) {
            rewardCompleteLesson = newRate;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("exam"))) {
            rewardPassExam = newRate;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("streak"))) {
            rewardDailyStreak = newRate;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("certification"))) {
            rewardCertification = newRate;
        } else if (keccak256(bytes(rewardType)) == keccak256(bytes("contest"))) {
            rewardWinContest = newRate;
        }
        emit RewardRateUpdated(rewardType, newRate);
    }

    /**
     * @dev Authorize an address to mint tokens
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minter authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Pause token operations
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 earned,
        uint256 spent
    ) {
        return (balanceOf(user), totalEarned[user], totalSpent[user]);
    }
}
