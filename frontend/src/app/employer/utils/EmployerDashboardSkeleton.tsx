import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Individual skeleton components for better modularity
export const EmployerStatCardSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) => {
  const getSkeletonHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-24';
      case 'featured':
        return 'h-32';
      default:
        return 'h-28';
    }
  };

  const getPadding = () => {
    switch (variant) {
      case 'compact':
        return 'p-4';
      case 'featured':
        return 'p-6';
      default:
        return 'p-6';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${getPadding()} ${getSkeletonHeight()} animate-pulse`}>
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="70%" className="rounded" />
          <Skeleton height={variant === 'featured' ? 32 : 28} width="50%" className="rounded" />
          {variant !== 'compact' && (
            <Skeleton height={12} width="60%" className="rounded" />
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <Skeleton 
            height={variant === 'featured' ? 64 : 48} 
            width={variant === 'featured' ? 64 : 48} 
            className="rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
};

export const EmployerChartSkeleton = ({ 
  title, 
  height = 300,
  showLegend = false 
}: { 
  title?: string; 
  height?: number;
  showLegend?: boolean;
}) => (
  <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
    {title && (
      <div className="mb-6">
        <Skeleton height={24} width={200} className="rounded" />
      </div>
    )}
    <div className="space-y-4">
      <Skeleton height={height} className="rounded-lg" />
      {showLegend && (
        <div className="flex justify-center space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton height={12} width={12} className="rounded-full" />
              <Skeleton height={12} width={60} className="rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const EmployerTableSkeleton = ({ 
  title = "Loading...", 
  rows = 5,
  hasAvatar = false,
  hasStatus = false 
}: { 
  title?: string; 
  rows?: number;
  hasAvatar?: boolean;
  hasStatus?: boolean;
}) => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="p-6 border-b border-gray-200">
      <Skeleton height={24} width={250} className="rounded" />
    </div>
    <div className="p-6 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          {hasAvatar && (
            <Skeleton height={40} width={40} circle className="flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="80%" className="rounded" />
            <Skeleton height={12} width="60%" className="rounded" />
          </div>
          {hasStatus && (
            <div className="flex-shrink-0">
              <Skeleton height={24} width={80} className="rounded-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const EmployerMetricsGridSkeleton = ({ 
  columns = 7,
  showInsights = true 
}: { 
  columns?: number;
  showInsights?: boolean;
}) => (
  <div className="space-y-6">
    {/* Main metrics */}
    <div className="w-full overflow-x-auto">
      <div className={`min-w-[1200px] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-${columns} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <EmployerStatCardSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* Insights section */}
    {showInsights && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <EmployerStatCardSkeleton key={`insight-${i}`} variant="compact" />
        ))}
      </div>
    )}
  </div>
);

export const EmployerJobListSkeleton = ({ jobCount = 5 }: { jobCount?: number }) => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="p-6 border-b border-gray-200">
      <Skeleton height={24} width={200} className="rounded" />
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: jobCount }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 space-y-2">
              <Skeleton height={18} width="70%" className="rounded" />
              <Skeleton height={14} width="50%" className="rounded" />
              <Skeleton height={12} width="30%" className="rounded" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton height={20} width={60} className="rounded" />
              <Skeleton height={12} width={80} className="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading states for different sections
export const EmployerAnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EmployerChartSkeleton title="Chart 1" showLegend={true} />
      <EmployerChartSkeleton title="Chart 2" height={250} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EmployerChartSkeleton title="Chart 3" height={280} />
      <EmployerChartSkeleton title="Chart 4" height={280} />
    </div>
  </div>
);

// Header skeleton
export const EmployerHeaderSkeleton = () => (
  <div className="flex items-center justify-between animate-pulse">
    <div className="space-y-2">
      <Skeleton height={32} width={250} className="rounded" />
      <Skeleton height={16} width={300} className="rounded" />
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton height={16} width={150} className="rounded" />
      <Skeleton height={40} width={100} className="rounded-lg" />
    </div>
  </div>
);

// Main dashboard skeleton
export const EmployerDashboardSkeleton = ({ 
  showHeader = true,
  showMetrics = true,
  showCharts = true,
  showTables = true,
  customSections = []
}: {
  showHeader?: boolean;
  showMetrics?: boolean;
  showCharts?: boolean;
  showTables?: boolean;
  customSections?: string[];
} = {}) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      {showHeader && <EmployerHeaderSkeleton />}

      {/* Metrics */}
      {showMetrics && <EmployerMetricsGridSkeleton />}

      {/* Charts */}
      {showCharts && <EmployerAnalyticsSkeleton />}

      {/* Job Performance */}
      {showTables && <EmployerJobListSkeleton />}

      {/* Recent Activity */}
      {showTables && (
        <EmployerTableSkeleton 
          title="Recent Applications" 
          hasAvatar={true}
          hasStatus={true}
          rows={6}
        />
      )}

      {/* Custom sections */}
      {customSections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <Skeleton height={24} width={200} className="mb-4 rounded" />
          <Skeleton height={100} className="rounded" />
        </div>
      ))}

      {/* Loading indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
          <span className="text-sm font-medium">Loading Dashboard...</span>
        </div>
      </div>
    </div>
  );
};

// Progressive loading skeleton that reveals sections gradually
export const ProgressiveEmployerSkeleton = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <EmployerHeaderSkeleton />
      
      {/* Staggered animation delays */}
      <div style={{ animationDelay: '0.2s' }} className="animate-fade-in">
        <EmployerMetricsGridSkeleton />
      </div>
      
      <div style={{ animationDelay: '0.4s' }} className="animate-fade-in">
        <EmployerAnalyticsSkeleton />
      </div>
      
      <div style={{ animationDelay: '0.6s' }} className="animate-fade-in">
        <EmployerJobListSkeleton />
      </div>
      
      <div style={{ animationDelay: '0.8s' }} className="animate-fade-in">
        <EmployerTableSkeleton hasAvatar={true} hasStatus={true} />
      </div>
    </div>
  );
};

// Error state skeleton
export const EmployerErrorSkeleton = ({ message = "Something went wrong" }: { message?: string }) => (
  <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Skeleton height={32} width={32} className="rounded" />
      </div>
      <Skeleton height={24} width={200} className="mx-auto mb-2 rounded" />
      <Skeleton height={16} width={300} className="mx-auto mb-4 rounded" />
      <Skeleton height={40} width={120} className="mx-auto rounded-lg" />
    </div>
  </div>
);
