import React from 'react';
import ProfileSidebar from '../components/sections/ProfileSidebar';
import ProfileMainContent from '../components/sections/ProfileMainContent';
import { mockUserProfile, mockProfileCompletion } from '../data/mockProfile';
import styles from '../assets/css/ProfilePage.module.css';

export default function ProfilePage(): JSX.Element {
  
  // Event handlers
  const handleEditPersonalInfo = () => {
    console.log('Edit personal info');
    // TODO: Implement edit personal info modal/page
  };

  const handleEditWorkExperience = () => {
    console.log('Edit work experience');
    // TODO: Implement edit work experience modal/page
  };

  const handleEditEducation = () => {
    console.log('Edit education');
    // TODO: Implement edit education modal/page
  };

  const handleEditSkills = () => {
    console.log('Edit skills');
    // TODO: Implement edit skills modal/page
  };

  const handleEditCertifications = () => {
    console.log('Edit certifications');
    // TODO: Implement edit certifications modal/page
  };

  const handleEditProjects = () => {
    console.log('Edit projects');
    // TODO: Implement edit projects modal/page
  };

  const handleEditAchievements = () => {
    console.log('Edit achievements');
    // TODO: Implement edit achievements modal/page
  };

  const handleEditSocialLinks = () => {
    console.log('Edit social links');
    // TODO: Implement edit social links modal/page
  };

  const handleUploadCV = () => {
    console.log('Upload CV');
    // TODO: Implement CV upload functionality
  };

  const handleDownloadCV = () => {
    console.log('Download CV');
    // TODO: Implement CV download functionality
  };

  const handleCompleteProfile = () => {
    console.log('Complete profile');
    // TODO: Navigate to profile completion wizard
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        {/* Page Header */}
        <div className={styles.profilePageHeader}>
          <h1 className={styles.profilePageTitle}>
            Hồ sơ cá nhân
          </h1>
          <p className={styles.profilePageSubtitle}>
            Quản lý và cập nhật thông tin hồ sơ của bạn
          </p>
        </div>

        {/* Main Content Grid */}
        <div className={styles.profileGrid}>
          {/* Left Column - Profile Sidebar */}
          <div>
            <ProfileSidebar
              profile={mockUserProfile}
              onEditPersonalInfo={handleEditPersonalInfo}
              onEditWorkExperience={handleEditWorkExperience}
              onEditEducation={handleEditEducation}
              onEditSkills={handleEditSkills}
              onEditCertifications={handleEditCertifications}
              onEditProjects={handleEditProjects}
              onEditAchievements={handleEditAchievements}
              onEditSocialLinks={handleEditSocialLinks}
              onUploadCV={handleUploadCV}
              onDownloadCV={handleDownloadCV}
            />
          </div>

          {/* Right Column - Main Content */}
          <div>
            <ProfileMainContent
              profile={mockUserProfile}
              completion={mockProfileCompletion}
              onCompleteProfile={handleCompleteProfile}
              onEditCertifications={handleEditCertifications}
              onEditProjects={handleEditProjects}
              onEditAchievements={handleEditAchievements}
              onEditSocialLinks={handleEditSocialLinks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
