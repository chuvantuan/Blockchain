// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CopyrightRegistry
 * @dev Smart contract để lưu trữ hash tài liệu học thuật và chứng minh bản quyền
 * @notice Chỉ lưu hash, không lưu nội dung tài liệu để bảo mật và tiết kiệm gas
 */
contract CopyrightRegistry is Ownable, Pausable, ReentrancyGuard {
    // Struct để lưu thông tin bản quyền tài liệu
    struct DocumentCopyright {
        bytes32 documentHash;        // Hash của tài liệu (SHA-256)
        address owner;               // Địa chỉ chủ sở hữu
        string title;                // Tiêu đề tài liệu
        string description;          // Mô tả tài liệu
        string category;             // Loại tài liệu (thesis, research, paper, etc.)
        string fileExtension;        // Phần mở rộng file (.pdf, .docx, etc.)
        uint256 fileSize;            // Kích thước file (bytes)
        uint256 timestamp;           // Thời điểm đăng ký
        bool isVerified;             // Trạng thái xác minh
        bool isActive;               // Trạng thái hoạt động
        string ipfsHash;             // IPFS hash nếu có
        string[] tags;               // Tags phân loại
    }

    // Mapping từ hash đến thông tin bản quyền
    mapping(bytes32 => DocumentCopyright) public documents;
    
    // Mapping từ owner đến danh sách hash tài liệu
    mapping(address => bytes32[]) public ownerDocuments;
    
    // Mapping từ category đến danh sách hash tài liệu
    mapping(string => bytes32[]) public categoryDocuments;
    
    // Danh sách tất cả hash đã đăng ký
    bytes32[] public allDocuments;
    
    // Fee để đăng ký bản quyền (có thể điều chỉnh)
    uint256 public registrationFee = 0.001 ether; // 0.001 ETH
    
    // Fee để xác minh tài liệu (có thể điều chỉnh)
    uint256 public verificationFee = 0.002 ether; // 0.002 ETH
    
    // Thống kê
    uint256 public totalDocuments;
    uint256 public totalVerified;
    
    // Events
    event DocumentRegistered(
        bytes32 indexed documentHash,
        address indexed owner,
        string title,
        uint256 timestamp
    );
    
    event DocumentVerified(
        bytes32 indexed documentHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    event DocumentUpdated(
        bytes32 indexed documentHash,
        address indexed owner,
        string field,
        uint256 timestamp
    );
    
    event FeeUpdated(string feeType, uint256 newFee);
    
    // Modifiers
    modifier documentExists(bytes32 _hash) {
        require(documents[_hash].timestamp > 0, "Document not found");
        _;
    }
    
    modifier onlyOwnerOrAuthorized(bytes32 _hash) {
        require(
            documents[_hash].owner == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }
    
    modifier validHash(bytes32 _hash) {
        require(_hash != bytes32(0), "Invalid hash");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Đăng ký bản quyền tài liệu mới
     * @param _documentHash Hash của tài liệu
     * @param _title Tiêu đề tài liệu
     * @param _description Mô tả tài liệu
     * @param _category Loại tài liệu
     * @param _fileExtension Phần mở rộng file
     * @param _fileSize Kích thước file
     * @param _ipfsHash IPFS hash (tùy chọn)
     * @param _tags Tags phân loại
     */
    function registerDocument(
        bytes32 _documentHash,
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _fileExtension,
        uint256 _fileSize,
        string memory _ipfsHash,
        string[] memory _tags
    ) external payable whenNotPaused nonReentrant validHash(_documentHash) {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        require(documents[_documentHash].timestamp == 0, "Document already registered");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        
        // Tạo struct mới
        DocumentCopyright memory newDoc = DocumentCopyright({
            documentHash: _documentHash,
            owner: msg.sender,
            title: _title,
            description: _description,
            category: _category,
            fileExtension: _fileExtension,
            fileSize: _fileSize,
            timestamp: block.timestamp,
            isVerified: false,
            isActive: true,
            ipfsHash: _ipfsHash,
            tags: _tags
        });
        
        // Lưu vào mapping
        documents[_documentHash] = newDoc;
        
        // Thêm vào danh sách owner
        ownerDocuments[msg.sender].push(_documentHash);
        
        // Thêm vào danh sách category
        categoryDocuments[_category].push(_documentHash);
        
        // Thêm vào danh sách tổng
        allDocuments.push(_documentHash);
        
        // Cập nhật thống kê
        totalDocuments++;
        
        // Refund nếu fee thừa
        if (msg.value > registrationFee) {
            payable(msg.sender).transfer(msg.value - registrationFee);
        }
        
        emit DocumentRegistered(_documentHash, msg.sender, _title, block.timestamp);
    }

    /**
     * @dev Xác minh tài liệu (chỉ owner)
     * @param _documentHash Hash của tài liệu cần xác minh
     */
    function verifyDocument(bytes32 _documentHash) 
        external 
        payable 
        whenNotPaused 
        documentExists(_documentHash) 
        onlyOwnerOrAuthorized(_documentHash) 
    {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(!documents[_documentHash].isVerified, "Document already verified");
        
        documents[_documentHash].isVerified = true;
        totalVerified++;
        
        // Refund nếu fee thừa
        if (msg.value > verificationFee) {
            payable(msg.sender).transfer(msg.value - verificationFee);
        }
        
        emit DocumentVerified(_documentHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Cập nhật thông tin tài liệu
     * @param _documentHash Hash của tài liệu
     * @param _field Trường cần cập nhật (title, description, tags)
     * @param _value Giá trị mới
     */
    function updateDocument(
        bytes32 _documentHash,
        string memory _field,
        string memory _value
    ) external whenNotPaused documentExists(_documentHash) onlyOwnerOrAuthorized(_documentHash) {
        require(documents[_documentHash].isActive, "Document is not active");
        
        if (keccak256(bytes(_field)) == keccak256(bytes("title"))) {
            require(bytes(_value).length > 0, "Title cannot be empty");
            documents[_documentHash].title = _value;
        } else if (keccak256(bytes(_field)) == keccak256(bytes("description"))) {
            documents[_documentHash].description = _value;
        }
        
        emit DocumentUpdated(_documentHash, msg.sender, _field, block.timestamp);
    }

    /**
     * @dev Cập nhật tags của tài liệu
     * @param _documentHash Hash của tài liệu
     * @param _newTags Tags mới
     */
    function updateDocumentTags(
        bytes32 _documentHash,
        string[] memory _newTags
    ) external whenNotPaused documentExists(_documentHash) onlyOwnerOrAuthorized(_documentHash) {
        require(documents[_documentHash].isActive, "Document is not active");
        
        documents[_documentHash].tags = _newTags;
        
        emit DocumentUpdated(_documentHash, msg.sender, "tags", block.timestamp);
    }

    /**
     * @dev Vô hiệu hóa tài liệu (chỉ owner)
     * @param _documentHash Hash của tài liệu
     */
    function deactivateDocument(bytes32 _documentHash) 
        external 
        whenNotPaused 
        documentExists(_documentHash) 
        onlyOwnerOrAuthorized(_documentHash) 
    {
        documents[_documentHash].isActive = false;
        
        emit DocumentUpdated(_documentHash, msg.sender, "deactivated", block.timestamp);
    }

    /**
     * @dev Kiểm tra tài liệu có tồn tại không
     * @param _documentHash Hash cần kiểm tra
     * @return exists True nếu tài liệu tồn tại
     */
    function documentExists(bytes32 _documentHash) external view returns (bool exists) {
        return documents[_documentHash].timestamp > 0;
    }

    /**
     * @dev Lấy thông tin tài liệu
     * @param _documentHash Hash của tài liệu
     * @return doc Thông tin tài liệu
     */
    function getDocument(bytes32 _documentHash) 
        external 
        view 
        documentExists(_documentHash) 
        returns (DocumentCopyright memory doc) 
    {
        return documents[_documentHash];
    }

    /**
     * @dev Lấy danh sách tài liệu của owner
     * @param _owner Địa chỉ owner
     * @return documentHashes Mảng hash tài liệu
     */
    function getOwnerDocuments(address _owner) 
        external 
        view 
        returns (bytes32[] memory documentHashes) 
    {
        return ownerDocuments[_owner];
    }

    /**
     * @dev Lấy danh sách tài liệu theo category
     * @param _category Category cần lấy
     * @return documentHashes Mảng hash tài liệu
     */
    function getCategoryDocuments(string memory _category) 
        external 
        view 
        returns (bytes32[] memory documentHashes) 
    {
        return categoryDocuments[_category];
    }

    /**
     * @dev Tìm kiếm tài liệu theo hash (partial match)
     * @param _partialHash Hash cần tìm (có thể là partial)
     * @return foundHashes Mảng hash tìm thấy
     */
    function searchDocuments(bytes32 _partialHash) 
        external 
        view 
        returns (bytes32[] memory foundHashes) 
    {
        bytes32[] memory tempHashes = new bytes32[](allDocuments.length);
        uint256 foundCount = 0;
        
        for (uint256 i = 0; i < allDocuments.length; i++) {
            if (allDocuments[i] & _partialHash == _partialHash) {
                tempHashes[foundCount] = allDocuments[i];
                foundCount++;
            }
        }
        
        bytes32[] memory result = new bytes32[](foundCount);
        for (uint256 i = 0; i < foundCount; i++) {
            result[i] = tempHashes[i];
        }
        
        return result;
    }

    /**
     * @dev Cập nhật registration fee (chỉ owner)
     * @param _newFee Fee mới
     */
    function updateRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit FeeUpdated("registration", _newFee);
    }

    /**
     * @dev Cập nhật verification fee (chỉ owner)
     * @param _newFee Fee mới
     */
    function updateVerificationFee(uint256 _newFee) external onlyOwner {
        verificationFee = _newFee;
        emit FeeUpdated("verification", _newFee);
    }

    /**
     * @dev Rút tiền từ contract (chỉ owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
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
     * @dev Lấy thống kê contract
     * @return stats Thống kê tổng quan
     */
    function getStatistics() external view returns (
        uint256 _totalDocuments,
        uint256 _totalVerified,
        uint256 _totalOwners,
        uint256 _contractBalance
    ) {
        // Đếm số owners unique (approximate)
        uint256 uniqueOwners = 0;
        address[] memory seenOwners = new address[](allDocuments.length);
        
        for (uint256 i = 0; i < allDocuments.length; i++) {
            address docOwner = documents[allDocuments[i]].owner;
            bool isSeen = false;
            
            for (uint256 j = 0; j < uniqueOwners; j++) {
                if (seenOwners[j] == docOwner) {
                    isSeen = true;
                    break;
                }
            }
            
            if (!isSeen) {
                seenOwners[uniqueOwners] = docOwner;
                uniqueOwners++;
            }
        }
        
        return (
            totalDocuments,
            totalVerified,
            uniqueOwners,
            address(this).balance
        );
    }
}
