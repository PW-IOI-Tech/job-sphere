// components/dashboard/JobSeekerDashboard.tsx
'use client';

import { useDashboard } from './utils/useDashboard';
import { PieChart } from './utils/PieChart';
import { BarChart } from './utils/BarChart';
import { StatCard } from './utils/StatCard';
import { DashboardSkeleton } from './utils/DashboardSkeleton';
import { 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Users, 
  RefreshCw,
  AlertCircle 
} from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const { data, loading, error, refetch, lastUpdated } = useDashboard(5 * 60 * 1000);

  // Show skeleton while loading
  if (loading && !data) {
    return <DashboardSkeleton />;
  }

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

  // Prepare chart data
  const applicationStatusData = [
    { label: 'Accepted', value: data.applicationStats.accepted, color: '#10B981' },
    { label: 'Rejected', value: data.applicationStats.rejected, color: '#EF4444' },
    { label: 'Pending', value: data.applicationStats.pending, color: '#F59E0B' },
    { label: 'Reviewing', value: data.applicationStats.reviewing, color: '#3B82F6' },
    { label: 'Shortlisted', value: data.applicationStats.shortlisted, color: '#8B5CF6' },
    { label: 'Interviewed', value: data.applicationStats.interviewed, color: '#06B6D4' },
  ].filter(item => item.value > 0);

  const topSkillsData = data.topSkills.map(skill => ({
    label: skill.skill,
    value: skill.count
  }));

  const topJobRolesData = data.topJobRoles.map(role => ({
    label: role.role.replace(/_/g, ' '),
    value: role.applicationsCount
  }));

  const topCompaniesData = data.topCompaniesByActiveJobs.map(company => ({
    label: company.name,
    value: company.activeJobsCount || 0
  }));

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Your job search analytics and insights
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Job Postings"
          value={data.todayJobPostings.count}
          trend={{
            value: data.todayJobPostings.percentageChange,
            direction: data.todayJobPostings.trend
          }}
          icon={<Briefcase className="w-6 h-6 text-blue-600" />}
        />
        
        <StatCard
          title="Total Applications"
          value={Object.values(data.applicationStats).reduce((sum, val) => sum + val, 0)}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
        />
        
        <StatCard
          title="Success Rate"
          value={`${Object.values(data.applicationStats).reduce((sum, val) => sum + val, 0) > 0 
            ? Math.round((data.applicationStats.accepted / Object.values(data.applicationStats).reduce((sum, val) => sum + val, 0)) * 100)
            : 0}%`}
          icon={<Users className="w-6 h-6 text-purple-600" />}
        />
        
        <StatCard
          title="Active Companies"
          value={data.topCompaniesByActiveJobs.length}
          icon={<Building2 className="w-6 h-6 text-orange-600" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={applicationStatusData}
          title="Application Status Distribution"
          className="lg:col-span-1"
        />

        <BarChart
  data={data.conversionFunnel.map(item => ({ label: item.stage, value: item.count }))}
  title="Application Conversion Funnel"
  color="#3B82F6"
  className="lg:col-span-1"
/>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <BarChart
          data={topJobRolesData}
          title="Top Applied Job Roles"
          color="#10B981"
        />
        
        <BarChart
          data={topSkillsData}
          title="Most Required Skills"
          color="#8B5CF6"
        />
        
        <BarChart
          data={topCompaniesData}
          title="Top Companies (Active Jobs)"
          color="#F59E0B"
        />
      </div>

      {/* Job Roles Details Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Job Role Competition Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  My Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Openings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Applicants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competition Ratio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topJobRoles.map((role, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.role.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.applicationsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.totalOpenings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.totalApplicants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      role.competitionRatio > 10 
                        ? 'bg-red-100 text-red-800' 
                        : role.competitionRatio > 5 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {role.competitionRatio.toFixed(1)}:1
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
