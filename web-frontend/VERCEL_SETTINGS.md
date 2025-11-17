# ⚠️ QUAN TRỌNG: Cấu hình Vercel Settings

## Vấn đề hiện tại
Build log cho thấy build hoàn tất quá nhanh (281ms) và không có file nào được tạo. Điều này có nghĩa là Vercel không tìm thấy project hoặc build command không chạy.

## Giải pháp: Kiểm tra Root Directory trong Vercel Dashboard

### Bước 1: Vào Vercel Dashboard
1. Truy cập https://vercel.com/dashboard
2. Chọn project `hoc_onl`
3. Vào **Settings** → **General**

### Bước 2: Kiểm tra Root Directory
**QUAN TRỌNG:** Root Directory phải được set đúng!

#### Nếu repo root là `hoc_onl` và project nằm trong `web-frontend/`:
- **Root Directory**: `web-frontend`
- **Build Command**: (để trống hoặc `npm run build`)
- **Output Directory**: (để trống hoặc `dist`)
- **Install Command**: (để trống hoặc `npm install`)

#### Nếu repo root là `web-frontend`:
- **Root Directory**: (để trống hoặc `.`)
- **Build Command**: (để trống hoặc `npm run build`)
- **Output Directory**: (để trống hoặc `dist`)
- **Install Command**: (để trống hoặc `npm install`)

### Bước 3: Kiểm tra Framework Preset
- **Framework Preset**: Chọn `Vite` hoặc `Other`
- Nếu chọn `Other`, Vercel sẽ tự động detect từ `vercel.json`

### Bước 4: Kiểm tra Environment Variables
Vào **Settings** → **Environment Variables** và đảm bảo có:
- `VITE_API_BASE_URL`: URL của backend API (nếu cần)

### Bước 5: Redeploy
Sau khi sửa settings:
1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **"..."** → **"Redeploy"**
4. Hoặc push code mới lên Git để trigger auto-deploy

## Kiểm tra Build Logs
Sau khi redeploy, kiểm tra Build Logs:
- Phải thấy: `Running "npm install"`
- Phải thấy: `Running "npm run build"`
- Phải thấy: `dist/index.html` và `dist/assets/` được tạo
- Build time phải > 10 giây (không phải 281ms)

## Nếu vẫn lỗi
1. Kiểm tra lại Root Directory
2. Xóa project và tạo lại trên Vercel
3. Đảm bảo `vercel.json` nằm đúng vị trí (cùng cấp với `package.json`)

