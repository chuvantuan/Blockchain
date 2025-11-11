// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ExamRecordContract
 * @dev Smart contract để lưu trữ kết quả thi và log gian lận on-chain
 * Đảm bảo tính minh bạch và không thể sửa đổi điểm số sau khi ghi
 */
contract ExamRecordContract is Ownable, Pausable {
    
    // Struct cho kết quả thi
    struct ExamResult {
        uint256 examId;
        address student;
        uint256 score;
        uint256 maxScore;
        uint256 timeSpent; // seconds
        uint256 timestamp;
        bool isPassed;
        string examTitle;
        bytes32 resultHash; // Hash của toàn bộ kết quả để verify
    }
    
    // Struct cho vi phạm gian lận
    struct CheatingViolation {
        uint256 examId;
        address student;
        uint8 violationType; // 1: face_detection, 2: eye_tracking, 3: multiple_faces, etc.
        uint8 severity; // 1: low, 2: medium, 3: high, 4: critical
        uint256 confidence; // 0-100
        uint256 timestamp;
        string description;
        string screenshotHash; // IPFS hash của screenshot
    }
    
    // Struct cho session thi
    struct ExamSession {
        uint256 examId;
        address student;
        uint256 startTime;
        uint256 endTime;
        bool isCompleted;
        uint256 totalViolations;
        uint256 criticalViolations;
        bool isFlagged; // Đánh dấu session có vi phạm nghiêm trọng
    }
    
    // Mappings
    mapping(uint256 => ExamResult) public examResults;
    mapping(uint256 => CheatingViolation[]) public examViolations;
    mapping(uint256 => ExamSession) public examSessions;
    mapping(address => uint256[]) public studentExams; // Danh sách exam của student
    
    // Counters
    uint256 public totalExams = 0;
    uint256 public totalViolations = 0;
    uint256 public totalSessions = 0;
    
    // Authorized addresses (backend services)
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event ExamResultRecorded(
        uint256 indexed examId,
        address indexed student,
        uint256 score,
        uint256 maxScore,
        bool isPassed,
        bytes32 resultHash
    );
    
    event CheatingViolationDetected(
        uint256 indexed examId,
        address indexed student,
        uint8 violationType,
        uint8 severity,
        uint256 confidence,
        string description
    );
    
    event ExamSessionStarted(
        uint256 indexed sessionId,
        uint256 indexed examId,
        address indexed student,
        uint256 startTime
    );
    
    event ExamSessionCompleted(
        uint256 indexed sessionId,
        uint256 indexed examId,
        address indexed student,
        bool isFlagged,
        uint256 totalViolations
    );
    
    event ResultHashUpdated(uint256 indexed examId, bytes32 oldHash, bytes32 newHash);
    
    // Modifiers
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }
    
    modifier onlyValidExam(uint256 examId) {
        require(examId > 0, "Invalid exam ID");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Bắt đầu session thi
     */
    function startExamSession(
        uint256 examId,
        address student,
        string memory examTitle
    ) external onlyMinter onlyValidExam(examId) whenNotPaused returns (uint256) {
        uint256 sessionId = totalSessions + 1;
        
        ExamSession storage session = examSessions[sessionId];
        session.examId = examId;
        session.student = student;
        session.startTime = block.timestamp;
        session.isCompleted = false;
        session.totalViolations = 0;
        session.criticalViolations = 0;
        session.isFlagged = false;
        
        totalSessions++;
        
        emit ExamSessionStarted(sessionId, examId, student, block.timestamp);
        
        return sessionId;
    }
    
    /**
     * @dev Ghi lại vi phạm gian lận
     */
    function recordCheatingViolation(
        uint256 sessionId,
        uint8 violationType,
        uint8 severity,
        uint256 confidence,
        string memory description,
        string memory screenshotHash
    ) external onlyMinter whenNotPaused {
        require(sessionId > 0 && sessionId <= totalSessions, "Invalid session ID");
        
        ExamSession storage session = examSessions[sessionId];
        require(!session.isCompleted, "Session already completed");
        
        CheatingViolation memory violation = CheatingViolation({
            examId: session.examId,
            student: session.student,
            violationType: violationType,
            severity: severity,
            confidence: confidence,
            timestamp: block.timestamp,
            description: description,
            screenshotHash: screenshotHash
        });
        
        examViolations[sessionId].push(violation);
        session.totalViolations++;
        
        if (severity == 4) { // Critical
            session.criticalViolations++;
            session.isFlagged = true;
        }
        
        totalViolations++;
        
        emit CheatingViolationDetected(
            session.examId,
            session.student,
            violationType,
            severity,
            confidence,
            description
        );
    }
    
    /**
     * @dev Hoàn thành session thi và ghi kết quả
     */
    function completeExamSession(
        uint256 sessionId,
        uint256 score,
        uint256 maxScore,
        uint256 timeSpent,
        string memory examTitle
    ) external onlyMinter whenNotPaused {
        require(sessionId > 0 && sessionId <= totalSessions, "Invalid session ID");
        
        ExamSession storage session = examSessions[sessionId];
        require(!session.isCompleted, "Session already completed");
        
        session.endTime = block.timestamp;
        session.isCompleted = true;
        
        // Tạo kết quả thi
        uint256 examId = session.examId;
        bool isPassed = score >= (maxScore * 50 / 100); // Pass if >= 50%
        
        // Tạo hash để verify tính toàn vẹn
        bytes32 resultHash = keccak256(abi.encodePacked(
            examId,
            session.student,
            score,
            maxScore,
            timeSpent,
            block.timestamp,
            session.totalViolations,
            session.criticalViolations
        ));
        
        ExamResult memory result = ExamResult({
            examId: examId,
            student: session.student,
            score: score,
            maxScore: maxScore,
            timeSpent: timeSpent,
            timestamp: block.timestamp,
            isPassed: isPassed,
            examTitle: examTitle,
            resultHash: resultHash
        });
        
        examResults[examId] = result;
        studentExams[session.student].push(examId);
        totalExams++;
        
        emit ExamResultRecorded(
            examId,
            session.student,
            score,
            maxScore,
            isPassed,
            resultHash
        );
        
        emit ExamSessionCompleted(
            sessionId,
            examId,
            session.student,
            session.isFlagged,
            session.totalViolations
        );
    }
    
    /**
     * @dev Verify tính toàn vẹn của kết quả thi
     */
    function verifyExamResult(uint256 examId) external view returns (bool) {
        ExamResult memory result = examResults[examId];
        require(result.examId > 0, "Exam result not found");
        
        bytes32 expectedHash = keccak256(abi.encodePacked(
            result.examId,
            result.student,
            result.score,
            result.maxScore,
            result.timeSpent,
            result.timestamp,
            examSessions[examId].totalViolations,
            examSessions[examId].criticalViolations
        ));
        
        return result.resultHash == expectedHash;
    }
    
    /**
     * @dev Lấy thông tin chi tiết session thi
     */
    function getExamSession(uint256 sessionId) external view returns (
        uint256 examId,
        address student,
        uint256 startTime,
        uint256 endTime,
        bool isCompleted,
        uint256 totalViolations,
        uint256 criticalViolations,
        bool isFlagged
    ) {
        require(sessionId > 0 && sessionId <= totalSessions, "Invalid session ID");
        
        ExamSession memory session = examSessions[sessionId];
        return (
            session.examId,
            session.student,
            session.startTime,
            session.endTime,
            session.isCompleted,
            session.totalViolations,
            session.criticalViolations,
            session.isFlagged
        );
    }
    
    /**
     * @dev Lấy danh sách vi phạm của session
     */
    function getSessionViolations(uint256 sessionId) external view returns (CheatingViolation[] memory) {
        require(sessionId > 0 && sessionId <= totalSessions, "Invalid session ID");
        return examViolations[sessionId];
    }
    
    /**
     * @dev Lấy kết quả thi của student
     */
    function getStudentExamResults(address student) external view returns (uint256[] memory) {
        return studentExams[student];
    }
    
    /**
     * @dev Lấy thống kê tổng quan
     */
    function getStatistics() external view returns (
        uint256 _totalExams,
        uint256 _totalViolations,
        uint256 _totalSessions,
        uint256 flaggedSessions
    ) {
        uint256 flagged = 0;
        for (uint256 i = 1; i <= totalSessions; i++) {
            if (examSessions[i].isFlagged) {
                flagged++;
            }
        }
        
        return (totalExams, totalViolations, totalSessions, flagged);
    }
    
    /**
     * @dev Authorize minter address
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Revoke minter authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency function để update hash nếu có lỗi (chỉ owner)
     */
    function emergencyUpdateResultHash(
        uint256 examId,
        bytes32 newHash
    ) external onlyOwner {
        require(examResults[examId].examId > 0, "Exam result not found");
        
        bytes32 oldHash = examResults[examId].resultHash;
        examResults[examId].resultHash = newHash;
        
        emit ResultHashUpdated(examId, oldHash, newHash);
    }
}
