import React, { useState } from 'react';
import Tabs from '../components/molecules/Tabs';
import LeaderboardTable from '../components/sections/LeaderboardTable';
import LeaderboardFilters from '../components/sections/LeaderboardFilters';
import {
  mockLeaderboardData,
  mockTabs,
  countries
} from '../data/mockLeaderboard';
import {
  LeaderboardEntry,
  LeaderboardFilters as LeaderboardFiltersType,
  PaginationInfo,
  TabOption,
  SortConfig
} from '../types/leaderboard';
import styles from '../assets/css/LeaderboardPage.module.css';
import { Users, Trophy, TrendingUp } from 'lucide-react';

export default function LeaderboardPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('algorithms');
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData);
  const [filters, setFilters] = useState<LeaderboardFiltersType>(mockLeaderboardData.filters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'score',
    direction: 'desc'
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update tabs state
    const updatedTabs = mockTabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));
    
    // Here you would typically fetch new data based on the selected tab
    console.log('Tab changed to:', tabId);
  };

  const handleFiltersChange = (newFilters: Partial<LeaderboardFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Here you would typically filter the data based on new filters
    console.log('Filters changed:', updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setLeaderboardData(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        currentPage: page
      }
    }));
    
    // Here you would typically fetch new page data
    console.log('Page changed to:', page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLeaderboardData(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        itemsPerPage,
        currentPage: 1 // Reset to first page when changing items per page
      }
    }));
    
    // Here you would typically fetch new data with new page size
    console.log('Items per page changed to:', itemsPerPage);
  };

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    
    // Here you would typically sort the data
    console.log('Sort by:', column, sortConfig.direction === 'desc' ? 'asc' : 'desc');
  };

  const tabs: TabOption[] = mockTabs.map(tab => ({
    ...tab,
    isActive: tab.id === activeTab
  }));

  const showAlgorithmScores = activeTab === 'algorithms';
  const showContestScores = activeTab === 'contests';

  return (
    <div className={styles.leaderboardPage}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            <Trophy className={styles.pageTitleIcon} />
            Bảng Xếp Hạng
          </h1>
          <p className={styles.pageDescription}>
            Cạnh tranh với những lập trình viên xuất sắc nhất từ khắp nơi trên thế giới
          </p>
        </div>

        {/* Stats Banner */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <Users className={styles.statIcon} />
            <span className={styles.statValue}>{mockLeaderboardData.pagination.totalItems}</span>
            <span className={styles.statLabel}>Người tham gia</span>
          </div>
          <div className={styles.statItem}>
            <Trophy className={styles.statIcon} />
            <span className={styles.statValue}>{mockTabs.length}</span>
            <span className={styles.statLabel}>Cuộc thi</span>
          </div>
          <div className={styles.statItem}>
            <TrendingUp className={styles.statIcon} />
            <span className={styles.statValue}>Live</span>
            <span className={styles.statLabel}>Trạng thái</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} onTabChange={handleTabChange} />

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Leaderboard Table */}
          <div className={styles.tableContainer}>
            <LeaderboardTable
              entries={leaderboardData.entries}
              pagination={leaderboardData.pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showAlgorithmScores={showAlgorithmScores}
              showContestScores={showContestScores}
              sortBy={sortConfig.column as any}
              sortOrder={sortConfig.direction}
              onSort={handleSort}
            />
          </div>

          {/* Filters Sidebar */}
          <LeaderboardFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            countries={countries}
          />
        </div>
      </div>
    </div>
  );
}
