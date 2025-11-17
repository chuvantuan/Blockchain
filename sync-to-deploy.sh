#!/bin/bash

# Script để đồng bộ code từ team repository sang repository cá nhân để deploy
# Team repo: https://github.com/vutong-coder/hoc_onl
# Personal repo: https://github.com/dao24092004/hoc_onl

set -e

echo "🔄 Đang đồng bộ code từ team repository..."

# Kiểm tra xem có thay đổi chưa commit không
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Có thay đổi chưa commit. Vui lòng commit hoặc stash trước khi sync."
    echo "💡 Chạy: git stash (để tạm lưu) hoặc git commit (để commit)"
    exit 1
fi

# Lấy code mới nhất từ team
echo "📥 Pulling code mới nhất từ team repository..."
if ! git pull origin main; then
    echo "❌ Lỗi khi pull từ team repository. Kiểm tra kết nối mạng và quyền truy cập."
    exit 1
fi

# Push lên repository cá nhân
echo "📤 Pushing code lên repository cá nhân để deploy..."
if ! git push personal main; then
    echo ""
    echo "❌ Lỗi khi push lên personal repository."
    echo ""
    echo "💡 Giải pháp:"
    echo "   1. Kiểm tra SSH key: ssh -T git@github.com"
    echo "   2. Hoặc sử dụng HTTPS với Personal Access Token:"
    echo "      git remote set-url personal https://github.com/dao24092004/hoc_onl.git"
    echo "      git push personal main"
    echo "   3. Xem hướng dẫn chi tiết trong SYNC_GUIDE.md"
    exit 1
fi

echo ""
echo "✅ Đồng bộ thành công!"
echo "📝 Repository team: https://github.com/vutong-coder/hoc_onl"
echo "🚀 Repository deploy: https://github.com/dao24092004/hoc_onl"

