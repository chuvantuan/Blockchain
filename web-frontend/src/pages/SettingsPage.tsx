import React, { useState } from 'react';
import WebAuthnRegistration from '../components/molecules/WebAuthnRegistration';
import { changePassword } from '../services/api/authApi';
import styles from '../assets/css/SettingsPage.module.css';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('security');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: false
    });
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false
    });
    
    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const tabs = [
        { id: 'security', label: 'Bảo mật' },
        { id: 'profile', label: 'Hồ sơ' },
        { id: 'notifications', label: 'Thông báo' },
        { id: 'privacy', label: 'Quyền riêng tư' },
        { id: 'appearance', label: 'Giao diện' }
    ];

    // Password change handlers
    const handleOpenPasswordModal = () => {
        setShowPasswordModal(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        setPasswordMessage(null);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        setPasswordMessage(null);
    };

    const validatePasswordForm = (): boolean => {
        const errors: typeof passwordErrors = {};
        
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        
        if (!passwordData.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }
        
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        if (passwordData.currentPassword === passwordData.newPassword) {
            errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        }
        
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setIsChangingPassword(true);
        setPasswordMessage(null);

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setTimeout(() => {
                handleClosePasswordModal();
            }, 2000);
        } catch (error: any) {
            setPasswordMessage({ 
                type: 'error', 
                text: error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' 
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const renderSecurityTab = () => (
        <div className={styles.tabContent}>
            {/* Password Section */}
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                    Mật khẩu
                </h3>
                <p className={styles.sectionDescription}>
                    Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                </p>
                <button 
                    onClick={handleOpenPasswordModal}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                >
                    Đổi mật khẩu
                </button>
            </div>

            {/* WebAuthn Section */}
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                    Xác thực sinh trắc học
                </h3>
                <WebAuthnRegistration />
            </div>

            {/* Two-Factor Authentication */}
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                    Xác thực hai yếu tố (2FA)
                </h3>
                <p className={styles.sectionDescription}>
                    Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                </p>
                <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.buttonSecondary}`}>
                        Cài đặt SMS
                    </button>
                    <button className={`${styles.button} ${styles.buttonSecondary}`}>
                        Cài đặt Email
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProfileTab = () => (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
                Thông tin cá nhân
            </h3>
            <div className={styles.formGroup}>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>
                        Họ và tên
                    </label>
                    <input 
                        type="text" 
                        placeholder="Nhập họ và tên"
                        className={styles.formInput}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>
                        Email
                    </label>
                    <input 
                        type="email" 
                        placeholder="example@email.com"
                        className={styles.formInput}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>
                        Số điện thoại
                    </label>
                    <input 
                        type="tel" 
                        placeholder="+84 xxx xxx xxx"
                        className={styles.formInput}
                    />
                </div>
                <button className={`${styles.button} ${styles.buttonPrimary} ${styles.formSaveButton}`}>
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
                Cài đặt thông báo
            </h3>
            <div className={styles.formGroup}>
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className={styles.toggleItem}>
                        <div className={styles.toggleItemContent}>
                            <h4 className={styles.toggleItemTitle}>
                                {key === 'email' ? 'Thông báo Email' : 
                                 key === 'push' ? 'Thông báo đẩy' : 'Thông báo SMS'}
                            </h4>
                            <p className={styles.toggleItemDescription}>
                                {key === 'email' ? 'Nhận thông báo qua email' : 
                                 key === 'push' ? 'Nhận thông báo trên trình duyệt' : 'Nhận thông báo qua SMS'}
                            </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications(prev => ({
                                    ...prev,
                                    [key]: e.target.checked
                                }))}
                                className={styles.toggleSwitchInput}
                            />
                            <span className={`${styles.toggleSwitchSlider} ${
                                value ? styles.toggleSwitchSliderActive : ''
                            }`}>
                                <span className={`${styles.toggleSwitchKnob} ${
                                    value ? styles.toggleSwitchKnobActive : ''
                                }`} />
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
                Quyền riêng tư
            </h3>
            <div className={styles.formGroup}>
                {Object.entries(privacy).map(([key, value]) => (
                    <div key={key} className={styles.toggleItem}>
                        <div className={styles.toggleItemContent}>
                            <h4 className={styles.toggleItemTitle}>
                                {key === 'profileVisible' ? 'Hiển thị hồ sơ công khai' : 
                                 key === 'showEmail' ? 'Hiển thị email' : 'Hiển thị số điện thoại'}
                            </h4>
                            <p className={styles.toggleItemDescription}>
                                {key === 'profileVisible' ? 'Cho phép người khác xem hồ sơ của bạn' : 
                                 key === 'showEmail' ? 'Hiển thị email trong hồ sơ công khai' : 'Hiển thị số điện thoại trong hồ sơ công khai'}
                            </p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setPrivacy(prev => ({
                                    ...prev,
                                    [key]: e.target.checked
                                }))}
                                className={styles.toggleSwitchInput}
                            />
                            <span className={`${styles.toggleSwitchSlider} ${
                                value ? styles.toggleSwitchSliderActive : ''
                            }`}>
                                <span className={`${styles.toggleSwitchKnob} ${
                                    value ? styles.toggleSwitchKnobActive : ''
                                }`} />
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
                Giao diện
            </h3>
            <div className={styles.formGroup}>
                <div>
                    <h4 className={styles.formLabel}>
                        Chế độ hiển thị
                    </h4>
                    <div className={styles.themeButtons}>
                        {['Sáng', 'Tối', 'Tự động'].map((theme) => (
                            <button 
                                key={theme} 
                                className={`${styles.themeButton} ${
                                    theme === 'Tối' ? styles.themeButtonActive : styles.themeButtonInactive
                                }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className={styles.formLabel}>
                        Ngôn ngữ
                    </h4>
                    <select className={styles.formSelect}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security': return renderSecurityTab();
            case 'profile': return renderProfileTab();
            case 'notifications': return renderNotificationsTab();
            case 'privacy': return renderPrivacyTab();
            case 'appearance': return renderAppearanceTab();
            default: return renderSecurityTab();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.headerTitle}>
                        Cài đặt tài khoản
                    </h1>
                    <p className={styles.headerSubtitle}>
                        Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm của bạn
                    </p>
                </div>

                <div className={styles.mainLayout}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <nav className={styles.sidebarNav}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${styles.sidebarButton} ${
                                        activeTab === tab.id
                                            ? styles.sidebarButtonActive
                                            : styles.sidebarButtonInactive
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={handleClosePasswordModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            Đổi mật khẩu
                        </h2>

                        {passwordMessage && (
                            <div className={`${styles.modalMessage} ${
                                passwordMessage.type === 'success'
                                    ? styles.modalMessageSuccess
                                    : styles.modalMessageError
                            }`}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <div className={styles.modalForm}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className={`${styles.formInput} ${
                                        passwordErrors.currentPassword ? styles.formInputError : ''
                                    }`}
                                />
                                {passwordErrors.currentPassword && (
                                    <p className={styles.formError}>
                                        {passwordErrors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    className={`${styles.formInput} ${
                                        passwordErrors.newPassword ? styles.formInputError : ''
                                    }`}
                                />
                                {passwordErrors.newPassword && (
                                    <p className={styles.formError}>
                                        {passwordErrors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className={`${styles.formInput} ${
                                        passwordErrors.confirmPassword ? styles.formInputError : ''
                                    }`}
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className={styles.formError}>
                                        {passwordErrors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                onClick={handleClosePasswordModal}
                                disabled={isChangingPassword}
                                className={`${styles.modalButton} ${styles.modalButtonCancel}`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className={`${styles.modalButton} ${styles.modalButtonSubmit}`}
                            >
                                {isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;