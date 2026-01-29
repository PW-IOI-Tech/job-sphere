// components/skeletons/ApplicationStatsSkeleton.tsx
import React from 'react';

const ApplicationStatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded-md w-48 mb-4"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-50 p-4 rounded">
            <div className="h-4 bg-gray-300 rounded-md w-32 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded-md w-16"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 p-4 rounded">
            <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded-md w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatsSkeleton;
