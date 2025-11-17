# 🔧 Hướng dẫn sửa lỗi Vercel Deployment

## Vấn đề hiện tại
Build log cho thấy build hoàn tất quá nhanh (282ms) và không có file nào được tạo. Điều này có nghĩa là Vercel không chạy build command.

## Giải pháp

### Cách 1: Set Root Directory trong Vercel Dashboard (KHUYẾN NGHỊ)

1. **Vào Vercel Dashboard**
   - Truy cập https://vercel.com/dashboard
   - Chọn project `hoc_onl`

2. **Vào Settings → General**
   - Scroll xuống phần **Build & Development Settings**

3. **Tìm và set Root Directory**
   - Nếu không thấy "Root Directory", có thể cần:
     - Click vào **"Override"** hoặc **"Edit"** ở phần Build Settings
     - Hoặc tìm trong **"Advanced"** hoặc **"Configuration"**

4. **Set các giá trị sau:**
   - **Root Directory**: `web-frontend` (hoặc để trống nếu không có option này)
   - **Framework Preset**: `Vite` hoặc `Other`
   - **Build Command**: (để trống - Vercel sẽ dùng từ `vercel.json`)
   - **Output Directory**: (để trống - Vercel sẽ dùng từ `vercel.json`)
   - **Install Command**: (để trống - Vercel sẽ dùng từ `vercel.json`)

5. **Lưu settings và Redeploy**

### Cách 2: Sử dụng Vercel CLI để set Root Directory

Nếu không tìm thấy Root Directory trong Dashboard, có thể dùng CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set root directory
vercel env pull
```

### Cách 3: Tạo project mới với Root Directory đúng

1. **Xóa project hiện tại trên Vercel** (hoặc tạo project mới)
2. **Import lại từ GitHub**
3. **Khi import, set Root Directory = `web-frontend`** ngay từ đầu
4. **Deploy**

## Kiểm tra Build Logs

Sau khi sửa, Build Logs phải có:
- ✅ `Running "cd web-frontend && npm ci"` (mất vài phút)
- ✅ `Running "cd web-frontend && npm run build"` (mất > 10 giây)
- ✅ Files trong `web-frontend/dist/` được tạo
- ✅ Build time > 10 giây (không phải 282ms)

## Files đã được tạo

1. **`vercel.json`** ở root với cấu hình:
   - `buildCommand`: `cd web-frontend && npm ci && npm run build`
   - `outputDirectory`: `web-frontend/dist`
   - `installCommand`: `cd web-frontend && npm ci`

2. **`package.json`** ở root để Vercel detect được project structure

## Nếu vẫn không hoạt động

1. Kiểm tra xem commit `06b071a` có chứa `vercel.json` và `package.json` ở root không
2. Thử tạo project mới trên Vercel với Root Directory = `web-frontend`
3. Hoặc liên hệ Vercel support

