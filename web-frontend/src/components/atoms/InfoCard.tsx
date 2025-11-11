import React from 'react';
import { InfoCardData } from '../../types/profile';
import { Edit3, Plus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import styles from '../../assets/css/ProfilePage.module.css';

interface InfoCardProps {
  data: InfoCardData;
  className?: string;
  style?: React.CSSProperties;
}

export default function InfoCard({ data, className = '', style = {} }: InfoCardProps): JSX.Element {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'incomplete':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'incomplete':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default:
        return 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
    }
  };

  const getButtonVariantStyles = () => {
    switch (data.actionButton?.variant) {
      case 'secondary':
        return {
          background: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: '1px solid var(--border)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)'
        };
      default:
        return {
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none'
        };
    }
  };

  return (
    <div
      className={`${styles.infoCard} ${className}`}
      style={style}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-foreground)',
            fontSize: '18px'
          }}>
            {data.icon}
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
              color: 'var(--foreground)'
            }}>
              {data.title}
            </h3>
            {data.status && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px'
              }}>
                {getStatusIcon()}
                <span style={{
                  fontSize: '12px',
                  color: 'var(--muted-foreground)',
                  textTransform: 'capitalize'
                }}>
                  {data.status}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {data.actionButton && (
          <button
            onClick={data.actionButton.onClick}
            style={{
              ...getButtonVariantStyles(),
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {data.status === 'completed' ? (
              <Edit3 style={{ width: '14px', height: '14px' }} />
            ) : (
              <Plus style={{ width: '14px', height: '14px' }} />
            )}
            {data.actionButton.text}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{
        color: 'var(--foreground)',
        lineHeight: 1.6
      }}>
        {data.content}
      </div>

      {/* Progress Bar */}
      {data.completionPercentage !== undefined && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--muted-foreground)'
            }}>
              Hoàn thành
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--foreground)'
            }}>
              {data.completionPercentage}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--muted)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${data.completionPercentage}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
