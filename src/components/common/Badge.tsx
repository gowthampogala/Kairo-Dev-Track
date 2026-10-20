import React from 'react';
import { TaskCategory } from '../../types';

interface BadgeProps {
  category?: TaskCategory;
  variant?: 'green' | 'red' | 'lime' | 'violet' | 'neutral' | 'active' | 'completed';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ category, variant, children, className = '' }) => {
  let badgeClass = 'badge';

  if (category) {
    switch (category) {
      case 'Learn':
        badgeClass += ' badge-learn';
        break;
      case 'Build':
        badgeClass += ' badge-build';
        break;
      case 'Practise':
        badgeClass += ' badge-practise';
        break;
      case 'Test':
        badgeClass += ' badge-test';
        break;
      case 'Review':
        badgeClass += ' badge-review';
        break;
    }
  } else if (variant) {
    switch (variant) {
      case 'active':
        badgeClass += ' badge-active';
        break;
      case 'completed':
      case 'green':
        badgeClass += ' badge-completed';
        break;
      case 'red':
        badgeClass += ' badge-review';
        break;
      default:
        break;
    }
  }

  return <span className={`${badgeClass} ${className}`}>{children}</span>;
};
