import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contest, ContestSection as ContestSectionType } from '../types/contest';
import { featuredContest, contestSections } from '../data/mockContests';
import FeaturedContest from '../components/sections/FeaturedContest';
import ContestSection from '../components/sections/ContestSection';
import Footer from '../components/layouts/Footer';
import styles from '../assets/css/CompetePage.module.css';

const CompetePage: React.FC = () => {
  const navigate = useNavigate();

  const handleContestActionClick = (contest: Contest) => {
    // Only navigate to contest detail page for "View Challenges" or "Xem thử thách" button
    if (contest.actionButtonText === 'View Challenges' || contest.actionButtonText === 'Xem thử thách') {
      navigate(`/user/compete/${contest.id}`);
    } else {
      // For other buttons (Register Now, View Details), show message that page is not designed yet
      console.log(`Action "${contest.actionButtonText}" clicked for contest: ${contest.id}`);
      alert(`Trang cho "${contest.actionButtonText}" chưa được thiết kế.`);
    }
  };

  const handleViewAllClick = (section: ContestSectionType) => {
    // In a real app, this would navigate to the full list page
    console.log(`View all clicked for section: ${section.title}`);
    // Example: navigate to section's dedicated page
  };

  const handleFeaturedContestClick = (contest: any) => {
    // In a real app, this would handle featured contest registration
    console.log(`Featured contest clicked: ${contest.id}`);
    // Example: navigate to registration or contest details
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Featured Contest */}
        <FeaturedContest
          contest={featuredContest}
          onActionClick={handleFeaturedContestClick}
        />

        {/* Contest Sections */}
        {contestSections.map((section) => (
          <ContestSection
            key={section.title}
            section={section}
            onContestActionClick={handleContestActionClick}
            onViewAllClick={handleViewAllClick}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CompetePage;
