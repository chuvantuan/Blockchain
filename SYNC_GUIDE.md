# 🔄 Hướng dẫn đồng bộ code giữa Team Repository và Personal Repository

## Vấn đề
- **Team Repository**: https://github.com/vutong-coder/hoc_onl (code mới nhất của team)
- **Personal Repository**: https://github.com/dao24092004/hoc_onl (dùng để deploy)

Khi deploy, cần code mới nhất từ team repository.

## Giải pháp đã thiết lập

### 1. Remote đã được cấu hình:
- `origin` → Team repository (vutong-coder/hoc_onl)
- `personal` → Personal repository (dao24092004/hoc_onl)

### 2. Cách sử dụng

#### Cách 1: Sử dụng script tự động (Khuyến nghị)
```bash
cd /home/minhdao/projects/team/code_spark/Front-end/hoc_onl
./sync-to-deploy.sh
```

#### Cách 2: Thủ công
```bash
# 1. Pull code mới nhất từ team
git pull origin main

# 2. Push lên repository cá nhân
git push personal main
```

## Cấu hình Authentication

### Nếu gặp lỗi authentication, có 2 cách:

### Cách A: Sử dụng SSH (Khuyến nghị)
1. Kiểm tra SSH key:
```bash
ls -la ~/.ssh/id_rsa.pub
```

2. Nếu chưa có, tạo SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

3. Thêm SSH key vào GitHub:
```bash
cat ~/.ssh/id_rsa.pub
# Copy và paste vào GitHub Settings > SSH and GPG keys
```

4. Test kết nối:
```bash
ssh -T git@github.com
```

### Cách B: Sử dụng Personal Access Token (PAT)
1. Tạo Personal Access Token trên GitHub:
   - Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Tạo token với quyền `repo`

2. Sử dụng token khi push:
```bash
git push https://YOUR_TOKEN@github.com/dao24092004/hoc_onl.git main
```

Hoặc cấu hình credential helper:
```bash
git config --global credential.helper store
git push personal main
# Nhập username và token khi được hỏi
```

## Workflow đề xuất

1. **Làm việc hàng ngày**: 
   - Pull từ `origin` (team repo) để lấy code mới nhất
   - Làm việc trên branch của bạn
   - Commit và push lên team repo

2. **Khi cần deploy**:
   - Chạy script `./sync-to-deploy.sh`
   - Hoặc thủ công: `git pull origin main && git push personal main`

## Lưu ý
- Luôn pull từ team repository trước khi push lên personal repository
- Đảm bảo working tree clean trước khi sync
- Nếu có conflict, resolve trước khi push

