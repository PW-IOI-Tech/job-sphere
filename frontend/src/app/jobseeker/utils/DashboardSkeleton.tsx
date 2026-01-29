// components/skeletons/DashboardSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton height={16} width={120} className="mb-2" />
        <Skeleton height={32} width={80} className="mb-2" />
        <div className="flex items-center">
          <Skeleton height={16} width={16} className="mr-2" />
          <Skeleton height={16} width={60} />
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <Skeleton height={48} width={48} className="rounded-lg" />
      </div>
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ title?: string; className?: string }> = ({ 
  title, 
  className = '' 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
    {title && <Skeleton height={24} width={200} className="mb-4" />}
    <div className="h-64 flex items-center justify-center">
      <Skeleton height={256} width="100%" />
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b border-gray-200">
      <Skeleton height={24} width={250} />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i} className="px-6 py-3 text-left">
                <Skeleton height={16} width={100} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton height={16} width={80} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton height={32} width={200} className="mb-2" />
        <Skeleton height={16} width={300} />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton height={16} width={150} />
        <Skeleton height={40} width={100} />
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Charts Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton title="Chart 1" />
      <ChartSkeleton title="Chart 2" />
    </div>

    {/* Secondary Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>

    {/* Table Skeleton */}
    <TableSkeleton />
  </div>
);
