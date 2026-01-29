// components/skeletons/ApplicationListSkeleton.tsx
import React from 'react';
import ApplicationCardSkeleton from './ApplicationCardSkletonCard';

interface ApplicationListSkeletonProps {
  count?: number;
}

const ApplicationListSkeleton: React.FC<ApplicationListSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ApplicationListSkeleton;
