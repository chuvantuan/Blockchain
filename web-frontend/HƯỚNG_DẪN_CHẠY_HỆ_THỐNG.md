# 🚀 HƯỚNG DẪN CHẠY HỆ THỐNG GIÁM SÁT THI CỬ

## ✅ Đã hoàn thành tích hợp

Hệ thống đã được tích hợp hoàn chỉnh giữa:
- ✅ **Frontend React** (web-frontend)
- ✅ **Backend Node.js** (Code-spark/services/proctoring-service)
- ✅ **Python AI Service** (Code-spark/services/proctoring-service/ai-service)

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- Python >= 3.8
- npm hoặc yarn
- Camera và microphone

## 🎯 CÁCH CHẠY NHANH (3 BƯỚC)

### Bước 1: Khởi động Backend Services

Mở terminal trong thư mục `Code-spark/services/proctoring-service`:

**Windows:**
```bash
cd Code-spark/services/proctoring-service
start-all.bat
```

**Linux/Mac:**
```bash
cd Code-spark/services/proctoring-service
chmod +x start-all.sh
./start-all.sh
```

Script sẽ tự động:
- ✅ Cài đặt dependencies (nếu chưa có)
- ✅ Khởi động Python AI Service (port 8000)
- ✅ Khởi động Node.js Service (port 8082)

### Bước 2: Tạo file .env (chỉ cần làm 1 lần)

Tạo file `.env` trong thư mục `Code-spark/services/proctoring-service/`:

```env
PORT=8082
NODE_ENV=development
AI_SERVICE_URL=http://localhost:8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proctoring_db
DB_USER=postgres
DB_PASSWORD=postgres
```

Hoặc copy từ file mẫu:
```bash
cd Code-spark/services/proctoring-service
cp .env.example .env
```

### Bước 3: Bật AI thật và chạy Frontend

1. **Bật AI thật trong code:**

Mở file `web-frontend/src/pages/ExamTakingPage.tsx`, dòng 24:

```typescript
// Đổi từ false sang true
const [useRealAI, setUseRealAI] = useState(true);
```

2. **Chạy frontend:**

```bash
cd web-frontend
npm install  # nếu chưa cài
npm run dev
```

3. **Mở trình duyệt:**
```
http://localhost:5173
```

## 🔍 Kiểm tra Services

### Test Python AI Service:
```bash
curl http://localhost:8000/docs
```
Hoặc mở: http://localhost:8000/docs

### Test Node.js Service:
```bash
curl http://localhost:8082/
```

Nếu thấy response → ✅ Services đang chạy!

## 🎮 Chế độ hoạt động

### Mock Mode (useRealAI = false)
- Dùng dữ liệu giả để test nhanh
- Không cần backend
- Tốt cho phát triển UI

### Real AI Mode (useRealAI = true) ⭐
- Sử dụng AI thật (YOLOv8 + MediaPipe)
- Phát hiện vi phạm chính xác
- Cần cả 2 backend services

## 📊 Flow hoạt động

```
1. Camera chụp frame (mỗi giây)
   ↓
2. Frontend gửi base64 image → Node.js Backend
   ↓
3. Node.js Backend → Python AI Service
   ↓
4. AI phân tích (YOLOv8 + MediaPipe)
   ↓
5. Trả kết quả → Frontend hiển thị alert
```

## 🐛 Troubleshooting

### ❌ Lỗi: "Cannot connect to backend"
**Giải pháp:** Chạy lại backend:
```bash
cd Code-spark/services/proctoring-service
start-all.bat  # Windows
./start-all.sh # Linux/Mac
```

### ❌ Lỗi: "ECONNREFUSED localhost:8000"
**Nguyên nhân:** Python AI Service chưa chạy

**Giải pháp:**
```bash
cd Code-spark/services/proctoring-service/ai-service
# Windows:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### ❌ Lỗi: "ModuleNotFoundError" (Python)
**Giải pháp:**
```bash
cd Code-spark/services/proctoring-service/ai-service
pip install -r requirements.txt
```

### ❌ Camera không hoạt động
**Giải pháp:**
- Cho phép quyền camera trong trình duyệt
- Đảm bảo không có app khác đang dùng camera
- Chạy trên localhost hoặc HTTPS

### ❌ Không thấy detection nào
**Kiểm tra:**
1. Console browser có lỗi không? (F12)
2. Backend có log lỗi không?
3. Kiểm tra `useRealAI` đã = `true` chưa?
4. Check Network tab xem API có được gọi không

## 📁 Cấu trúc File đã tạo/sửa

### Backend
```
Code-spark/services/proctoring-service/
├── src/
│   ├── controllers/proctoring.controller.js  ✅ Thêm analyzeFrame()
│   └── routes/proctoring.routes.js           ✅ Thêm POST /analyze-frame
├── ai-service/
│   └── main.py                               ✅ FastAPI AI service
├── start-all.bat                             ✅ MỚI - Script Windows
├── start-all.sh                              ✅ MỚI - Script Linux/Mac
├── .env.example                              ✅ MỚI - Cấu hình mẫu
└── README-SETUP.md                           ✅ MỚI - Hướng dẫn chi tiết
```

### Frontend
```
web-frontend/
├── src/
│   ├── services/
│   │   └── proctoringService.ts              ✅ MỚI - API service
│   ├── hooks/
│   │   └── useAICameraMonitor.ts             ✅ Thêm useRealAI logic
│   ├── components/molecules/
│   │   └── AICameraMonitor.tsx               ✅ Thêm useRealAI prop
│   └── pages/
│       └── ExamTakingPage.tsx                ✅ Thêm useRealAI state
└── PROCTORING_INTEGRATION_GUIDE.md           ✅ MỚI - Hướng dẫn tích hợp
```

## 📚 Tài liệu chi tiết

- **Backend Setup:** `Code-spark/services/proctoring-service/README-SETUP.md`
- **Frontend Integration:** `web-frontend/PROCTORING_INTEGRATION_GUIDE.md`
- **API Docs:** http://localhost:8000/docs (khi chạy Python service)

## 🎯 Các loại vi phạm được phát hiện

| Loại | Mô tả | Độ nghiêm trọng |
|------|-------|----------------|
| 🚫 Không phát hiện khuôn mặt | Sinh viên không trong khung hình | High |
| 👥 Nhiều người | Có người khác trong phòng | Critical |
| 👀 Nhìn ra ngoài | Mắt nhìn khỏi màn hình | Medium |
| 📱 Điện thoại | Phát hiện điện thoại di động | High |
| 🎭 Che camera | Camera bị che hoặc làm mờ | High |
| ⚠️ Hành vi khả nghi | Các hành động bất thường khác | Medium |

## 🔥 Demo nhanh

Test API bằng curl:

```bash
# Get base64 của một ảnh
base64 test-image.jpg > image.txt

# Test API
curl -X POST http://localhost:8082/api/proctoring/analyze-frame \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "examId": "test-exam",
    "studentId": "test-student"
  }'
```

## ✨ Tính năng đã tích hợp

- ✅ Real-time camera monitoring
- ✅ AI-powered cheating detection (YOLOv8 + MediaPipe)
- ✅ Multiple violation types detection
- ✅ Screenshot capture for evidence
- ✅ Severity-based alerting
- ✅ Blockchain integration ready
- ✅ Mock/Real AI switching
- ✅ Auto-start camera
- ✅ Vietnamese language support

## 📞 Liên hệ

Nếu gặp vấn đề, hãy check:
1. Console logs (F12 trong browser)
2. Backend terminal logs
3. Python service logs

---

**Chúc bạn thành công! 🎉**

Made with ❤️ by AI Assistant

