# 🚀 Hướng dẫn Deploy lên Vercel

## 📋 Yêu cầu

1. Tài khoản Vercel (đăng ký tại [vercel.com](https://vercel.com))
2. Git repository đã push code lên GitHub/GitLab/Bitbucket
3. Backend services đã được deploy và có public URL

## 🔧 Bước 1: Chuẩn bị Environment Variables

Trước khi deploy, bạn cần cấu hình các biến môi trường sau trong Vercel:

### Environment Variables cần thiết:

```bash
# API Gateway URL (thay bằng URL thực tế của bạn)
VITE_API_BASE_URL=https://your-api-gateway.com

# Course Service API URL
VITE_COURSE_API_URL=https://your-course-service.com/api

# Token Reward Service API URL
VITE_TOKEN_REWARD_API_URL=https://your-token-reward-service.com

# Blockchain Contract Addresses (nếu sử dụng)
VITE_LEARN_TOKEN_ADDRESS=0x...
VITE_COPYRIGHT_REGISTRY_ADDRESS=0x...
```

## 📝 Bước 2: Deploy qua Vercel Dashboard

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Đăng nhập Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập bằng GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New..." → "Project"
   - Chọn repository `hoc_onl`
   - Chọn root directory: `Front-end/hoc_onl/web-frontend`

3. **Cấu hình Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `Front-end/hoc_onl/web-frontend`
   - **Build Command**: `npm run build` (tự động detect)
   - **Output Directory**: `dist` (tự động detect)
   - **Install Command**: `npm install` (tự động detect)

4. **Thêm Environment Variables**
   - Vào tab "Environment Variables"
   - Thêm tất cả các biến môi trường ở trên
   - Chọn môi trường: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Chờ build hoàn thành (thường 2-5 phút)

## 📝 Bước 3: Deploy qua Vercel CLI

### Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### Đăng nhập

```bash
vercel login
```

### Deploy

```bash
cd Front-end/hoc_onl/web-frontend
vercel
```

Lần đầu tiên sẽ hỏi:
- Set up and deploy? → **Y**
- Which scope? → Chọn account của bạn
- Link to existing project? → **N** (lần đầu)
- Project name? → `hoc-onl-frontend` (hoặc tên bạn muốn)
- Directory? → `./` (current directory)
- Override settings? → **N**

### Thêm Environment Variables qua CLI

```bash
vercel env add VITE_API_BASE_URL
# Nhập giá trị khi được hỏi
# Chọn môi trường: Production, Preview, Development

vercel env add VITE_COURSE_API_URL
vercel env add VITE_TOKEN_REWARD_API_URL
vercel env add VITE_LEARN_TOKEN_ADDRESS
vercel env add VITE_COPYRIGHT_REGISTRY_ADDRESS
```

### Deploy Production

```bash
vercel --prod
```

## 🔍 Bước 4: Kiểm tra Deployment

Sau khi deploy thành công:

1. **Kiểm tra URL**
   - Vercel sẽ cung cấp URL: `https://your-project.vercel.app`
   - Kiểm tra xem trang có load được không

2. **Kiểm tra Console**
   - Mở DevTools → Console
   - Kiểm tra xem có lỗi API nào không
   - Đảm bảo các API calls đang dùng đúng URL

3. **Kiểm tra Environment Variables**
   - Vào Vercel Dashboard → Project → Settings → Environment Variables
   - Đảm bảo tất cả biến đã được thêm

## 🔄 Bước 5: Cập nhật API URLs trong Code

Nếu bạn đã hardcode `localhost` trong code, cần cập nhật:

### ✅ Đã được cập nhật:
- `copyrightService.ts` - Sử dụng `VITE_API_BASE_URL`
- `authApi.ts` - Sử dụng `VITE_API_BASE_URL`
- `courseApi.ts` - Sử dụng `VITE_COURSE_API_URL`
- `tokenRewardApi.ts` - Sử dụng `VITE_TOKEN_REWARD_API_URL`

### ⚠️ Cần cập nhật thủ công:
- `DocumentViewerModal.tsx` - Dòng 53
- `CopyrightDocumentsList.tsx` - Dòng 274

Cập nhật từ:
```typescript
fetch(`http://localhost:8080/api/copyrights/download/${documentId}`, {
```

Thành:
```typescript
const downloadUrl = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/copyrights/download/${documentId}`
  : `http://localhost:8080/api/copyrights/download/${documentId}`;
fetch(downloadUrl, {
```

## 🛠️ Troubleshooting

### Lỗi Build

1. **Build fails với TypeScript errors**
   ```bash
   # Chạy build local trước
   npm run build
   # Sửa các lỗi TypeScript
   ```

2. **Build fails với missing dependencies**
   ```bash
   # Đảm bảo package.json có đầy đủ dependencies
   npm install
   ```

### Lỗi Runtime

1. **API calls fail với CORS**
   - Đảm bảo backend đã cấu hình CORS cho Vercel domain
   - Thêm Vercel URL vào CORS whitelist

2. **Environment variables không hoạt động**
   - Kiểm tra tên biến có đúng prefix `VITE_` không
   - Restart deployment sau khi thêm env vars
   - Clear cache và rebuild

3. **404 trên các routes**
   - File `vercel.json` đã có rewrite rules
   - Đảm bảo `outputDirectory` là `dist`

## 📊 Monitoring

Vercel cung cấp:
- **Analytics**: Traffic, performance metrics
- **Logs**: Real-time deployment và runtime logs
- **Speed Insights**: Core Web Vitals

Truy cập: Vercel Dashboard → Project → Analytics/Logs

## 🔐 Security

1. **Không commit `.env` files**
   - Đã có trong `.gitignore`
   - Sử dụng Vercel Environment Variables

2. **API Keys**
   - Không hardcode trong code
   - Sử dụng Environment Variables

3. **HTTPS**
   - Vercel tự động cung cấp HTTPS
   - SSL certificate tự động renew

## 🚀 Custom Domain

1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn
4. Chờ SSL certificate được cấp (thường vài phút)

## 📝 Notes

- Vercel tự động deploy khi push code lên branch `main`/`master`
- Preview deployments cho mỗi Pull Request
- Rollback dễ dàng qua Vercel Dashboard

---

**Chúc bạn deploy thành công! 🎉**

