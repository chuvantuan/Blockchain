import React from 'react';
import { Challenge } from '../../types/contestDetail';
import styles from '../../assets/css/ChallengeCard.module.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onSolveClick: (challenge: Challenge) => void;
  onDiscussionClick?: (challenge: Challenge) => void;
  onLeaderboardClick?: (challenge: Challenge) => void;
  onSubmissionsClick?: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onSolveClick,
  onDiscussionClick,
  onLeaderboardClick,
  onSubmissionsClick
}) => {
  const handleSolveClick = () => {
    onSolveClick(challenge);
  };

  const handleDiscussionClick = () => {
    if (onDiscussionClick) {
      onDiscussionClick(challenge);
    }
  };

  const handleLeaderboardClick = () => {
    if (onLeaderboardClick) {
      onLeaderboardClick(challenge);
    }
  };

  const handleSubmissionsClick = () => {
    if (onSubmissionsClick) {
      onSubmissionsClick(challenge);
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
      case 'Dễ': 
        return styles.difficultyEasy;
      case 'Medium':
      case 'Trung bình': 
        return styles.difficultyMedium;
      case 'Hard':
      case 'Khó': 
        return styles.difficultyHard;
      default: 
        return styles.difficultyEasy;
    }
  };

  const getStatusIcon = (status: Challenge['status']) => {
    switch (status) {
      case 'solved': return '✅';
      case 'attempted': return '🔄';
      case 'not_attempted': return '⭕';
      default: return '⭕';
    }
  };

  const getDifficultyText = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'Dễ';
      case 'Medium': return 'Trung bình';
      case 'Hard': return 'Khó';
      default: return difficulty;
    }
  };

  return (
    <div className={styles.challengeCard}>
      <div className={styles.challengeHeader}>
        <div className={styles.challengeInfo}>
          <h3 className={styles.challengeTitle}>
            {getStatusIcon(challenge.status)} {challenge.title}
          </h3>
          <div className={styles.challengeStats}>
            <span className={styles.stat}>
              Tỷ lệ thành công: <strong>{challenge.successRate.toFixed(2)}%</strong>
            </span>
            <span className={styles.stat}>
              Điểm tối đa: <strong>{challenge.maxScore}</strong>
            </span>
            <span className={`${styles.stat} ${styles.difficulty} ${getDifficultyColor(challenge.difficulty)}`}>
              Độ khó: <strong>{getDifficultyText(challenge.difficulty)}</strong>
            </span>
          </div>
        </div>
        
        <div className={styles.challengeActions}>
          <div className={styles.actionIcons}>
            <button
              className={styles.actionIcon}
              onClick={handleDiscussionClick}
              title="Thảo luận"
              type="button"
            >
              💬
            </button>
            <button
              className={styles.actionIcon}
              onClick={handleLeaderboardClick}
              title="Bảng xếp hạng"
              type="button"
            >
              🏆
            </button>
            <button
              className={styles.actionIcon}
              onClick={handleSubmissionsClick}
              title="Bài nộp"
              type="button"
            >
              📋
            </button>
          </div>
          
          <button
            className={styles.solveButton}
            onClick={handleSolveClick}
            type="button"
          >
            Giải thử thách
          </button>
        </div>
      </div>
      
      {challenge.description && (
        <div className={styles.challengeDescription}>
          <p>{challenge.description}</p>
        </div>
      )}
      
      {challenge.tags && challenge.tags.length > 0 && (
        <div className={styles.challengeTags}>
          {challenge.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
