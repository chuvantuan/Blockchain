import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CertificationDetail } from '../types/certificationDetail';
import { mockCertificationDetails } from '../data/mockCertificationDetails';
import CertificationDetailHero from '../components/sections/CertificationDetailHero';
import FAQSection from '../components/sections/FAQSection';
import CertifyFooter from '../components/sections/CertifyFooter';
import styles from '../assets/css/CertificationDetailPage.module.css';

const CertificationDetailPage: React.FC = () => {
  const { certificationId } = useParams<{ certificationId: string }>();
  const navigate = useNavigate();
  const [certification, setCertification] = useState<CertificationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (certificationId && mockCertificationDetails[certificationId]) {
        setCertification(mockCertificationDetails[certificationId]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [certificationId]);

  const handleGetCertified = () => {
    // In a real app, this would redirect to the actual certification test
    console.log(`Starting certification test for: ${certificationId}`);
    // For demo purposes, show an alert
    alert(`Starting ${certification?.title} ${certification?.subtitle} certification test!`);
  };

  const handleBackToCertify = () => {
    navigate('/user/certify');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Đang tải chi tiết chứng chỉ...</p>
      </div>
    );
  }

  if (!certification) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Không tìm thấy chứng chỉ</h1>
        <p className={styles.errorText}>
          Chứng chỉ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button 
          className={styles.backButton}
          onClick={handleBackToCertify}
        >
          Quay lại chứng chỉ
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Navigation */}
        <nav className={styles.navigation}>
          <button 
            className={styles.backButton}
            onClick={handleBackToCertify}
          >
            ← Quay lại chứng chỉ
          </button>
        </nav>

        {/* Hero Section */}
        <CertificationDetailHero
          certification={certification}
          onGetCertified={handleGetCertified}
        />

        {/* FAQ Section */}
        <FAQSection
          faqs={certification.faqs}
          onGetCertified={handleGetCertified}
        />
        
        {/* Footer */}
        <CertifyFooter />
      </div>
    </div>
  );
};

export default CertificationDetailPage;
