import React from 'react';
import CertifyHero from '../components/sections/CertifyHero';
import CertificationSection from '../components/sections/CertificationSection';
import CertifyFooter from '../components/sections/CertifyFooter';
import { certificationSections } from '../data/mockCertifications';
import styles from '../assets/css/CertifyPage.module.css';

const CertifyPage: React.FC = () => {
  const handleGetCertified = (certificationId: string) => {
    // TODO: Implement certification logic
    console.log(`Starting certification for: ${certificationId}`);
    // Có thể redirect đến trang exam hoặc hiển thị modal
  };

  return (
    <div className={styles.page}>
      <CertifyHero />
      
      {certificationSections.map((section) => (
        <CertificationSection
          key={section.title}
          section={section}
          onGetCertified={handleGetCertified}
        />
      ))}
      
      <CertifyFooter />
    </div>
  );
};

export default CertifyPage;
