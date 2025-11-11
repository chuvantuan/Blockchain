import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContestDetail, Challenge } from '../types/contestDetail';
import { contestDetails } from '../data/mockContestDetails';
import ContestDetailHero from '../components/sections/ContestDetailHero';
import ChallengeCard from '../components/molecules/ChallengeCard';
import ContestSidebar from '../components/molecules/ContestSidebar';
import Footer from '../components/layouts/Footer';
import styles from '../assets/css/ContestDetailPage.module.css';

const ContestDetailPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  // Get contest data
  const contest: ContestDetail | undefined = contestId ? contestDetails[contestId] : undefined;

  if (!contest) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.container}>
          <h1>Không tìm thấy cuộc thi</h1>
          <p>Cuộc thi bạn đang tìm kiếm không tồn tại.</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/user/compete')}
            type="button"
          >
            Quay lại cuộc thi
          </button>
        </div>
      </div>
    );
  }

  const handleSolveChallenge = (challenge: Challenge) => {
    console.log(`Solve challenge clicked: ${challenge.id}`);
    // TODO: Navigate to challenge solving page
  };

  const handleDiscussionClick = (challenge: Challenge) => {
    console.log(`Discussion clicked for challenge: ${challenge.id}`);
    // TODO: Open discussion modal or navigate to discussion page
  };

  const handleLeaderboardClick = (challenge: Challenge) => {
    console.log(`Leaderboard clicked for challenge: ${challenge.id}`);
    // TODO: Open leaderboard modal or navigate to leaderboard page
  };

  const handleSubmissionsClick = (challenge: Challenge) => {
    console.log(`Submissions clicked for challenge: ${challenge.id}`);
    // TODO: Open submissions modal or navigate to submissions page
  };

  const handleDetailsClick = () => {
    console.log(`Details clicked for contest: ${contest.id}`);
    // TODO: Open contest details modal
  };

  const handleSidebarLeaderboardClick = () => {
    console.log(`Sidebar leaderboard clicked for contest: ${contest.id}`);
    // TODO: Navigate to contest leaderboard
  };

  const handleCompareProgressClick = () => {
    console.log(`Compare progress clicked for contest: ${contest.id}`);
    // TODO: Navigate to progress comparison page
  };

  const handleReviewSubmissionsClick = () => {
    console.log(`Review submissions clicked for contest: ${contest.id}`);
    // TODO: Navigate to submissions review page
  };

  const handleMessageSend = (message: string) => {
    console.log(`Message sent: ${message} for contest: ${contest.id}`);
    // TODO: Send message to contest organizers
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero Section */}
        <ContestDetailHero 
          contest={contest}
          onDetailsClick={handleDetailsClick}
        />

        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Challenges List */}
            <div className={styles.challengesSection}>
              {contest.challenges.length > 0 ? (
                contest.challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSolveClick={handleSolveChallenge}
                    onDiscussionClick={handleDiscussionClick}
                    onLeaderboardClick={handleLeaderboardClick}
                    onSubmissionsClick={handleSubmissionsClick}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <h3>Không có thử thách nào</h3>
                  <p>Cuộc thi này chưa có thử thách nào.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <ContestSidebar
              contest={contest}
              onLeaderboardClick={handleSidebarLeaderboardClick}
              onCompareProgressClick={handleCompareProgressClick}
              onReviewSubmissionsClick={handleReviewSubmissionsClick}
              onMessageSend={handleMessageSend}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContestDetailPage;
