import React from 'react';
import { CheckCircle, FileText, Video } from 'lucide-react';

interface ExamProgressIndicatorProps {
  currentStep: 'loading' | 'instructions' | 'camera-check' | 'ready';
}

export const ExamProgressIndicator: React.FC<ExamProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { key: 'instructions', label: 'Hướng dẫn', icon: FileText },
    { key: 'camera-check', label: 'Kiểm tra camera', icon: Video },
    { key: 'ready', label: 'Sẵn sàng', icon: CheckCircle }
  ];

  return (
    <div style={{
      background: 'var(--card)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: 'var(--space-6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.key;
          const isCompleted = ['instructions', 'camera-check', 'ready'].indexOf(currentStep) > index;
          
          return (
            <React.Fragment key={step.key}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--gradient-primary)' : isCompleted ? 'var(--gradient-accent)' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 'var(--space-3)',
                  transition: 'all var(--transition-normal)',
                  boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                }}>
                  <Icon style={{
                    width: '24px',
                    height: '24px',
                    color: isActive || isCompleted ? 'white' : 'var(--muted-foreground)'
                  }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isActive ? 'var(--foreground)' : isCompleted ? 'var(--foreground)' : 'var(--muted-foreground)',
                    margin: 0,
                    marginBottom: 'var(--space-1)'
                  }}>
                    {step.label}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--muted-foreground)',
                    margin: 0
                  }}>
                    {isActive ? 'Đang thực hiện...' : isCompleted ? 'Hoàn thành' : 'Chờ thực hiện'}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '60px',
                  height: '2px',
                  background: isCompleted ? 'var(--gradient-accent)' : 'var(--muted)',
                  margin: '0 var(--space-4)',
                  borderRadius: '1px',
                  transition: 'all var(--transition-normal)'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
