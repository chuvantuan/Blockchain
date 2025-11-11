import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Certification } from '../../types/certification';
import styles from '../../assets/css/CertificationCard.module.css';

interface CertificationCardProps {
  certification: Certification;
  onGetCertified: (certificationId: string) => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onGetCertified
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleGetCertified = () => {
    // Navigate to certification detail page
    navigate(`/user/certify/${certification.id}`);
    onGetCertified(certification.id);
  };

  const getIconComponent = (iconName: string) => {
    // Enhanced icon mapping with better visual representation
    const iconMap: { [key: string]: string } = {
      react: '⚛️',
      angular: '🅰️',
      javascript: '🟨',
      typescript: '🔷',
      java: '☕',
      python: '🐍',
      go: '🐹',
      csharp: '🔷',
      css: '🎨',
      code: '💻'
    };
    
    return iconMap[iconName] || '📜';
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Cơ bản':
      case 'Basic':
        return styles.levelBasic;
      case 'Trung cấp':
      case 'Intermediate':
        return styles.levelIntermediate;
      case 'Nâng cao':
      case 'Advanced':
        return styles.levelAdvanced;
      default:
        return styles.levelBasic;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{certification.title}</h3>
            <span className={`${styles.levelBadge} ${getLevelBadgeClass(certification.level)}`}>
              {certification.level}
            </span>
          </div>
          <div className={styles.tooltipContainer}>
            <button 
              className={styles.infoButton} 
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              ℹ️
            </button>
            {showTooltip && certification.description && (
              <div className={styles.tooltip}>
                <div className={styles.tooltipContent}>
                  {certification.description}
                </div>
                <div className={styles.tooltipArrow}></div>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className={styles.getCertifiedButton}
          onClick={handleGetCertified}
        >
          Nhận chứng chỉ
        </button>
      </div>
      
      <div 
        className={styles.backgroundIcon}
        style={{ color: certification.color }}
      >
        {getIconComponent(certification.icon)}
      </div>
    </div>
  );
};

export default CertificationCard;
