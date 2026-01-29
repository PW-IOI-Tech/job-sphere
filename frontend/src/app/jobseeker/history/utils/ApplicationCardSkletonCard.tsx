// components/skeletons/ApplicationCardSkeleton.tsx
import React from 'react';

const ApplicationCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded-md w-1/2 mb-3"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-300 rounded-md w-20"></div>
            <div className="h-4 bg-gray-300 rounded-md w-16"></div>
            <div className="h-4 bg-gray-300 rounded-md w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-300 rounded-md w-32"></div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-300 rounded-md w-24"></div>
          <div className="h-9 bg-gray-300 rounded-md w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCardSkeleton;
