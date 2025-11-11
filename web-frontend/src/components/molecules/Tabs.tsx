import React from 'react';
import { TabsProps } from '../../types/leaderboard';

export default function Tabs({ tabs, onTabChange }: TabsProps): JSX.Element {

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div style={{
      display: 'flex',
      borderBottom: '2px solid var(--border)',
      marginBottom: '32px',
      gap: '4px',
      position: 'relative'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          style={{
            padding: '14px 28px',
            background: tab.isActive
              ? 'linear-gradient(180deg, var(--card) 0%, var(--background) 100%)'
              : 'transparent',
            border: 'none',
            borderBottom: tab.isActive ? '3px solid var(--primary)' : '3px solid transparent',
            borderTopLeftRadius: tab.isActive ? 'var(--radius-md)' : '0',
            borderTopRightRadius: tab.isActive ? 'var(--radius-md)' : '0',
            color: tab.isActive ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: '15px',
            fontWeight: tab.isActive ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            transform: tab.isActive ? 'translateY(2px)' : 'translateY(0)',
            boxShadow: tab.isActive
              ? '0 -2px 8px rgba(0,0,0,0.05)'
              : 'none',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => {
            if (!tab.isActive) {
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.background = 'var(--muted)';
              e.currentTarget.style.borderTopLeftRadius = 'var(--radius-md)';
              e.currentTarget.style.borderTopRightRadius = 'var(--radius-md)';
            }
          }}
          onMouseLeave={(e) => {
            if (!tab.isActive) {
              e.currentTarget.style.color = 'var(--muted-foreground)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderRadius = '0';
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
