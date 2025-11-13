# Xây dựng Secure Password Storage – Demo Bcrypt/Argon2 vs MD5/SHA1

## 📋 Giới thiệu Ngắn Gọn Về Đề Tài

Đề tài này nhằm **so sánh hiệu suất bảo mật** giữa các thuật toán mã hóa mật khẩu hiện đại (Bcrypt, Argon2) và các thuật toán lỏi thời (MD5, SHA-1). 

Qua một ứng dụng web tương tác, người dùng có thể:
- **Nhập một mật khẩu** và hệ thống sẽ mã hóa nó bằng nhiều thuật toán khác nhau
- **Thực hiện tấn công Brute Force** để so sánh thời gian crack
- **Quan sát rõ ràng** sự khác biệt về bảo mật:
  - MD5/SHA-1: Crack trong vài mili-giây (rất nguy hiểm)
  - Bcrypt: Không crack được trong 5 giây (an toàn)

---

## 🛠️ Công Nghệ Sử Dụng

### Backend (Admin Service)
| Thành phần | Công nghệ | Phiên bản |
|-----------|-----------|----------|
| **Ngôn ngữ** | Java | 21 |
| **Framework** | Spring Boot | 3.3.0 |
| **Bảo mật** | Spring Security | 3.3.0 |
| **Database** | PostgreSQL | 14+ |
| **Build Tool** | Maven | 3.8+ |
| **Logging** | SLF4J + Logback | Mặc định |
| **Eureka Client** | Spring Cloud Netflix | 2023.0.1 |

**Thư viện Cryptography:**
- `BCryptPasswordEncoder` (Spring Security) - cho Bcrypt
- `java.security.MessageDigest` - cho MD5 và SHA-1

### Frontend (Web)
| Thành phần | Công nghệ | Phiên bản |
|-----------|-----------|----------|
| **Ngôn ngữ** | TypeScript | 5.6.3+ |
| **Framework** | React | 18.3.1+ |
| **Build Tool** | Vite | 7.1.10+ |
| **HTTP Client** | Axios | 1.12.2+ |
| **Styling** | Bootstrap 5 | 5.3.8+ |
| **Icons** | Lucide React | 0.468.0+ |
| **Testing** | Vitest | 3.2.4+ |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
Code-spark/
├── services/
│   ├── admin-service/                    # 🎯 Service chính (Security Demo)
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/dao/adminservice/
│   │   │   │   │   ├── controller/
│   │   │   │   │   │   └── SecurityDemoController.java    # Endpoint API
│   │   │   │   │   ├── service/
│   │   │   │   │   │   └── SecurityDemoService.java       # Logic cracking
│   │   │   │   │   ├── entity/
│   │   │   │   │   │   └── CrackDemoHistory.java          # Lịch sử test
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── CrackRequest.java
│   │   │   │   │   │   ├── CrackResult.java
│   │   │   │   │   │   └── CrackDemoResponse.java
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   └── CrackDemoHistoryRepository.java
│   │   │   │   │   └── config/
│   │   │   │   │       └── SecurityConfig.java
│   │   │   │   └── resources/
│   │   │   │       └── application.properties           # Cấu hình DB
│   │   │   └── test/
│   │   ├── pom.xml                                      # Dependency Maven
│   │   └── Dockerfile                                   # Docker config
│   │
│   └── [Other services...]
│
└── web-frontend/                         # 🎨 Frontend React
    ├── src/
    │   ├── pages/
    │   │   ├── SecurityDemoPage.tsx                     # Main page
    │   │   └── AdminPage/
    │   │       ├── CrackDemo.tsx                        # Input & results
    │   │       └── HistoryTable.tsx                     # Lịch sử test
    │   ├── services/
    │   │   └── adminService.ts                          # API calls
    │   ├── components/
    │   │   ├── atoms/
    │   │   └── molecules/
    │   └── types/
    ├── public/
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

### Giải Thích Các Thư Mục Chính

| Thư Mục | Mô Tả |
|--------|-------|
| `controller/` | Xử lý HTTP requests từ frontend (API endpoints) |
| `service/` | Business logic: mã hóa, brute force, lưu lịch sử |
| `entity/` | JPA entity đại diện cho bảng database |
| `dto/` | Data Transfer Objects dùng cho API communication |
| `repository/` | Database access layer (Spring Data JPA) |
| `config/` | Cấu hình ứng dụng (Spring Security, Database, etc.) |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Chương Trình

### Yêu Cầu Môi Trường

#### Backend (Admin Service)
- **Java JDK**: phiên bản 21 trở lên
- **Maven**: 3.8.0 trở lên
- **PostgreSQL**: 14 trở lên
- **Git**: để clone repository

#### Frontend (Web)
- **Node.js**: 18 trở lên  
- **npm**: 9 trở lên
- **TypeScript**: tự động cài qua npm

#### System
- **OS**: Windows, macOS, hoặc Linux
- **RAM**: tối thiểu 4GB
- **Disk**: tối thiểu 2GB

### 1️⃣ Cài Đặt & Chạy Backend (Admin Service)

#### Bước 1: Kiểm tra phiên bản Java
```bash
java -version
javac -version
```

**Kết quả mong đợi:**
```
openjdk version "21" 2023-09-19
```

#### Bước 2: Cài đặt và chạy PostgreSQL

**Option A: Dùng Docker**
```bash
docker run --name postgres-admin \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=admin_db \
  -p 5433:5432 \
  -d postgres:14-alpine
```

**Option B: Cài đặt trực tiếp**
- Tải từ: https://www.postgresql.org/download/
- Mặc định user: `postgres`, password: `password`
- Tạo database: 
```sql
CREATE DATABASE admin_db;
```

#### Bước 3: Cấu hình file kết nối Database

File: `services/admin-service/src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5433/admin_db
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Server Port
server.port=9003

# Eureka (nếu dùng service discovery)
eureka.client.service-url.defaultZone=http://localhost:9999/eureka/
```

#### Bước 4: Lệnh chạy Backend

**Tại thư mục `Code-spark/`:**

```bash
# Build project
mvn clean package -DskipTests -pl services/admin-service -am

# Run service
mvn spring-boot:run -pl services/admin-service
```

**Hoặc chạy trực tiếp:**
```bash
cd services/admin-service
mvn clean install
java -jar target/admin-service-0.0.1-SNAPSHOT.jar
```

**Kết quả mong đợi:**
```
Started AdminServiceApplication in 8.234 seconds
[main] com.dao.adminservice.AdminServiceApplication : Started
Tomcat started on port(s): 9003
```

---

### 2️⃣ Cài Đặt & Chạy Frontend (Web)

#### Bước 1: Cài đặt Dependencies

**Tại thư mục `web-frontend/`:**

```bash
# Cài đặt packages
npm install

#### Bước 2: Cấu hình API Backend URL (tùy chọn)

File: `web-frontend/src/services/adminService.ts`

```typescript
// The base URL should point to your API Gateway or Admin Service
const API_BASE_URL = 'http://localhost:8080/api/v1/admin/security';
```

#### Bước 3: Lệnh chạy Frontend

```bash
# Development mode (hot reload)
npm run dev

# Hoặc
npm start
```

**Kết quả mong đợi:**
```
  VITE v7.1.10  ready in 234 ms

  ➜  Local:   http://localhost:44173/
  ➜  press h to show help
```

#### Bước 4: Build cho Production (tùy chọn)

```bash
npm run build
npm run preview
```

---

### 3️⃣ Verify Installation

#### ✅ Kiểm tra Backend

```bash
# Test API endpoint
curl -X GET http://localhost:9003/api/v1/admin/security/crack-demo/history

# Hoặc dùng Postman:
# GET http://localhost:9003/api/v1/admin/security/crack-demo/history
```

**Kết quả:** Trả về JSON array (có thể rỗng)

#### ✅ Kiểm tra Frontend

- Mở trình duyệt: `http://localhost:4173/`
- Tìm trang "Password Security Demonstration" hoặc "Security Demo"
- Giao diện hiển thị input field cho mật khẩu

---

## 💻 Cách Sử Dụng Hệ Thống

### Workflow Demo

1. **Truy cập trang Security Demo:**
   - URL: `http://localhost:4173/` (hoặc route tương ứng)
   - Tìm phần "Password Security Demonstration"

2. **Nhập một mật khẩu:**
   - Tối đa 6 ký tự (giới hạn để demo nhanh)
   - Ví dụ: `abc123`, `hello`, `12345`

3. **Nhấn "Run Crack Demo":**
   - Hệ thống sẽ:
     - **Mã hóa** mật khẩu bằng MD5, SHA-1, Bcrypt
     - **Thực hiện tấn công Brute Force** trên mỗi hash
     - **So sánh thời gian crack**

4. **Xem kết quả:**
   ```
   MD5:  Cracked in 45ms after 15,234 attempts
   SHA-1: Cracked in 67ms after 15,234 attempts
   Bcrypt: Not cracked (timeout sau 5 giây)
   ```

5. **Lịch sử test:**
   - Toàn bộ kết quả được lưu vào database
   - Xem lại trong bảng "History Table"

---

## 🔐 Tài Khoản Demo & Đăng Nhập

### Hệ thống hiện tại
Đề tài này **tập trung vào Security Demo** (không yêu cầu đăng nhập xác thực).

Tuy nhiên, nếu muốn thêm quyền kiểm soát:

| Vai Trò | Username | Password | Ghi Chú |
|--------|----------|----------|---------|
| Admin | `admin` | `Admin@123456` | Quyền truy cập tất cả demo |
| User | `user` | `User@123456` | Quyền xem kết quả |

(Cấu hình trong `SecurityConfig.java` nếu thêm authentication)

---

## 🔧 Endpoints API

### 1. Chạy Demo Crack
```http
POST http://localhost:9003/api/v1/admin/security/crack-demo
Content-Type: application/json

{
  "password": "abc123"
}
```

**Response:**
```json
{
  "originalPassword": "abc123",
  "results": [
    {
      "algorithm": "MD5",
      "hash": "e99a18c428cb38d5f260853678922e03",
      "cracked": true,
      "timeTakenMs": 45,
      "attempts": 15234,
      "crackedPassword": "abc123"
    },
    {
      "algorithm": "SHA-1",
      "hash": "a9993e364706816aba3e25717850c26c9cd0d89d",
      "cracked": true,
      "timeTakenMs": 67,
      "attempts": 15234,
      "crackedPassword": "abc123"
    },
    {
      "algorithm": "Bcrypt",
      "hash": "$2a$10$...",
      "cracked": false,
      "timeTakenMs": 5000,
      "attempts": 892304,
      "crackedPassword": null
    }
  ]
}
```

### 2. Lấy Lịch Sử Test
```http
GET http://localhost:9003/api/v1/admin/security/crack-demo/history
```

**Response:**
```json
[
  {
    "id": 1,
    "originalPassword": "abc123",
    "algorithm": "MD5",
    "hashValue": "e99a18c428cb38d5f260853678922e03",
    "cracked": true,
    "timeTakenMs": 45,
    "attempts": 15234,
    "crackedPassword": "abc123",
    "testTimestamp": "2024-11-13T10:30:00Z"
  },
  ...
]
```

---

## 📊 Database Schema

### Bảng: `crack_demo_history`

```sql
CREATE TABLE crack_demo_history (
    id SERIAL PRIMARY KEY,
    original_password VARCHAR(255) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    hash_value TEXT NOT NULL,
    cracked BOOLEAN NOT NULL,
    time_taken_ms BIGINT NOT NULL,
    attempts BIGINT NOT NULL,
    cracked_password VARCHAR(255),
    test_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### Chạy Unit Tests (Backend)

```bash
cd services/admin-service
mvn test
```

### Chạy Frontend Tests

```bash
cd web-frontend
npm run dev
```

---

## 🐳 Chạy Với Docker

### Build Docker Image

```bash
cd services/admin-service
docker build -t code-spark/admin-service:latest .
```

### Dùng Docker Compose

```bash
# Tại root directory
docker-compose up -d
```

---

## 📚 Các Thuật Toán Được Hỗ Trợ

### Hiện Tại Hỗ Trợ:

| Thuật Toán | Loại | Bảo Mật | Tốc Độ Crack |
|-----------|------|--------|-------------|
| **MD5** | Hash Function | ❌ Rất Yếu | Rất Nhanh (mili-giây) |
| **SHA-1** | Hash Function | ❌ Yếu | Nhanh (mili-giây) |
| **Bcrypt** | Password Hashing | ✅ Mạnh | Rất Chậm (timeout) |

---

## ⚠️ Lưu Ý Bảo Mật

⛔ **KHÔNG** sử dụng MD5/SHA-1 để lưu trữ mật khẩu trong production
✅ **NÊN** sử dụng Bcrypt, Argon2, hoặc PBKDF2