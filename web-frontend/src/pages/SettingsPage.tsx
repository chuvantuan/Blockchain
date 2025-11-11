import React from 'react';
import WebAuthnRegistration from '../components/molecules/WebAuthnRegistration';

const SettingsPage: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Cài đặt bảo mật</h2>
            <p>Quản lý các phương thức đăng nhập của bạn.</p>
            <hr style={{ margin: '1.5rem 0' }} />
            <WebAuthnRegistration />
        </div>
    );
};

export default SettingsPage;