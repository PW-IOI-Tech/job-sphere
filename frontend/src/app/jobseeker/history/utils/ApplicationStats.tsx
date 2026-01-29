import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, Users, Calendar } from 'lucide-react';
import { useApplicationStats } from './useApplicationHIstory';
import ApplicationStatsSkeleton from './ApplicationStatsSkleton';

const ApplicationStats: React.FC = () => {
  const { stats, loading, error } = useApplicationStats();

  if (loading) return <ApplicationStatsSkeleton />;
  if (error) return null;
  if (!stats) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Overview</h2>
            <p className="text-gray-600 text-sm mt-1">Your job application statistics and insights</p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="p-8">
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Recent (30 days)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recent.count}</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byStatus.PENDING }</p>
              </div>
            </div>
          </div>

          {/* Accepted */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl shadow-md">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Accepted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byStatus.ACCEPTED}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          {/* Rejected */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl shadow-md">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byStatus.REJECTED}</p>
              </div>
            </div>
          </div>

          {/* Interviewed */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-xl shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Interviewed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byStatus.INTERVIEWED}</p>
              </div>
            </div>
          </div>

          {/* Shortlisted */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-500 rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byStatus.SHORTLISTED || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStats;
