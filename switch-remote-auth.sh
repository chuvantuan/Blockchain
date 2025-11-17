#!/bin/bash

# Script để chuyển đổi giữa SSH và HTTPS cho remote personal

REMOTE_NAME="personal"
SSH_URL="git@github.com:dao24092004/hoc_onl.git"
HTTPS_URL="https://github.com/dao24092004/hoc_onl.git"

CURRENT_URL=$(git remote get-url $REMOTE_NAME 2>/dev/null || echo "")

echo "🔧 Chuyển đổi authentication method cho remote 'personal'"
echo ""

if [[ "$CURRENT_URL" == *"git@"* ]]; then
    echo "📌 Hiện tại đang dùng: SSH"
    echo "🔄 Chuyển sang: HTTPS"
    git remote set-url $REMOTE_NAME $HTTPS_URL
    echo "✅ Đã chuyển sang HTTPS"
    echo ""
    echo "💡 Khi push, bạn sẽ cần nhập:"
    echo "   - Username: dao24092004"
    echo "   - Password: Personal Access Token (không phải mật khẩu GitHub)"
    echo ""
    echo "📝 Tạo token tại: https://github.com/settings/tokens"
else
    echo "📌 Hiện tại đang dùng: HTTPS"
    echo "🔄 Chuyển sang: SSH"
    git remote set-url $REMOTE_NAME $SSH_URL
    echo "✅ Đã chuyển sang SSH"
    echo ""
    echo "💡 Đảm bảo SSH key đã được thêm vào GitHub"
    echo "📝 Kiểm tra: ssh -T git@github.com"
fi

echo ""
echo "🔍 Remote hiện tại:"
git remote -v | grep personal

