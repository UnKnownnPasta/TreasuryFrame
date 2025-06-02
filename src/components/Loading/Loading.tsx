import './loading.css'
import { ReactNode } from 'react';

interface LoadingProps {
  children?: ReactNode;
  showSkeleton?: boolean;
}

export const Loading = ({ children, showSkeleton = false }: LoadingProps) => {
  if (showSkeleton) {
    return (
      <div className="skeleton-container">
        {children}
        <div className="skeleton-layout">
          <div className="skeleton-header loading-skeleton" />
          <div className="skeleton-content">
            <div className="skeleton-row loading-skeleton" />
            <div className="skeleton-row loading-skeleton" />
            <div className="skeleton-box loading-skeleton" />
          </div>
        </div>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-animation">
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};
