import React from 'react';
import styles from '../../assets/css/SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  onViewAllClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showViewAll = false,
  viewAllLink,
  onViewAllClick
}) => {
  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else if (viewAllLink) {
      // In a real app, this would navigate to the link
      console.log(`Navigating to: ${viewAllLink}`);
    }
  };

  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.title}>{title}</h2>
      {showViewAll && (
        <button
          className={styles.viewAllButton}
          onClick={handleViewAllClick}
          type="button"
          aria-label="Xem tất cả"
        >
          Xem tất cả
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
