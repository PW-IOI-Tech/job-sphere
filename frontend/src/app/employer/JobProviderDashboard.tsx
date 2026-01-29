'use client';

import { useEmployerDashboard } from './utils/useEmployerDashboard';
import { PieChart } from '@/app/jobseeker/utils/PieChart';
import { BarChart } from '@/app/jobseeker/utils/BarChart';
import { StatCard } from './utils/StatCard';
import { EmployerDashboardSkeleton } from './utils/EmployerDashboardSkeleton';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  RefreshCw,
  AlertCircle,
  Target,
  CheckCircle,
  UserCheck,
  Eye,
  Calendar
} from 'lucide-react';

export const JobProviderDashboard: React.FC = () => {
  const { data, loading, error, refetch, lastUpdated } = useEmployerDashboard(5 * 60 * 1000);

  if (loading && !data) return <EmployerDashboardSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="text-red-700 font-medium">Error loading dashboard</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Pie chart: Application status distribution with proper color mapping
  const candidateStatusData = data.applicationStats.statusDistribution.map(stat => ({
    label: stat.status,
    value: stat.count,
    color: stat.status === "ACCEPTED" ? "#10B981" :
           stat.status === "SHORTLISTED" ? "#8B5CF6" :
           stat.status === "INTERVIEWED" ? "#3B82F6" :
           stat.status === "REVIEWING" ? "#F59E0B" :
           stat.status === "PENDING" ? "#6B7280" :
           stat.status === "REJECTED" ? "#EF4444" :
           "#94A3B8"
  }));

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Recruitment analytics and hiring insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1200px] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {/* <StatCard
            title="Total Jobs"
            value={data.overview.totalJobs}
            icon={<Briefcase className="w-5 h-5 text-blue-600" />}
          /> */}
          <StatCard
            title="Active Jobs"
            value={data.overview.activeJobs}
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          />
          {/* <StatCard
            title="Total Applicants"
            value={data.overview.totalApplicants}
            icon={<Users className="w-5 h-5 text-purple-600" />}
          /> */}
          <StatCard
            title="This Month Applicants"
            value={data.overview.applicantsThisMonth}
            icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Shortlisted"
            value={data.overview.shortlistedCandidates}
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Pending Review"
            value={data.overview.pendingApplications}
            icon={<Clock className="w-5 h-5 text-orange-600" />}
          />
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Avg Applications/Job"
          value={data.insights.averageApplicationsPerJob}
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Response Rate"
          value={`${data.insights.responseRate}%`}
          icon={<Eye className="w-5 h-5 text-indigo-600" />}
        />

        <StatCard
            title="Conversion Rate"
            value={`${data.overview.conversionRate}%`}
            icon={<Target className="w-5 h-5 text-red-600" />}
          />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={candidateStatusData}
          title="Application Status Distribution"
        />

        <BarChart
          data={data.analytics.applicationsOverTime.map(d => ({
            label: d.monthName,
            value: d.applications
          }))}
          title="Applications Over Time"
          color="#3B82F6"
        />
      </div>

      {/* Top Roles and Hiring Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={data.analytics.topJobRoles.map(role => ({
            label: role.role.replace('_', ' '),
            value: role.totalApplications
          }))}
          title="Top Job Roles by Applications"
          color="#10B981"
        />

        <BarChart
          data={data.analytics.hiringTrends.map(trend => ({
            label: trend.monthName,
            value: trend.hired
          }))}
          title="Hiring Trends"
          color="#8B5CF6"
        />
      </div>

      {/* Top Performing Jobs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Top Performing Jobs</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.analytics.topPerformingJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.role.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">{job.daysActive} days active</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{job.applicationCount}</p>
                  <p className="text-xs text-gray-500">applications</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
        </div>
        <div className="p-6 space-y-4">
          {data.recentActivity.map((app) => (
            <div key={app.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {app.candidatePhoto ? (
                  <img 
                    src={app.candidatePhoto} 
                    alt={app.candidateName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{app.candidateName}</p>
                <p className="text-sm text-gray-600">
                  Applied for {app.jobTitle} • {app.jobRole.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500">{app.timeAgo}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  app.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                  app.status === 'INTERVIEWED' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'REVIEWING' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
