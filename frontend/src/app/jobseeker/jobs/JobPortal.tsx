'use client';
import { useJobs } from './utils/useJobs';
import { useProfile } from './utils/useProfile';
import { JobFilters } from './utils/JobFilters';
import { JobList } from './utils/JobList';
import { Pagination } from './utils/Pagination';
import Image from 'next/image';
import { 
  Search, 
  Briefcase, 
  TrendingUp, 
  Users, 
  MapPin, 
  Star,
  RefreshCw,
  User,
  Grid3X3,
  List,
  SortDesc
} from 'lucide-react';
import { useState, useMemo } from 'react';


export const JobPortal: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('latest');
  
  const {
    jobs: rawJobs,
    error,
    pagination,
    updateFilters,
    changePage,
    refetch,
  } = useJobs({
    initialFilters: { page: 1 },
    autoFetch: true,
  });

  const { profile } = useProfile();

  // Sort jobs based on selected sort option
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...rawJobs];
    
    switch (sortBy) {
      case 'latest':
        return jobsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      case 'salary_high':
        return jobsCopy.sort((a, b) => {
          const aSalary = a.salaryMax || a.salaryMin || 0;
          const bSalary = b.salaryMax || b.salaryMin || 0;
          return bSalary - aSalary;
        });
      
      case 'salary_low':
        return jobsCopy.sort((a, b) => {
          const aSalary = a.salaryMin || a.salaryMax || 0;
          const bSalary = b.salaryMin || b.salaryMax || 0;
          return aSalary - bSalary;
        });
      
      case 'applications':
        return jobsCopy.sort((a, b) => b._count.applications - a._count.applications);
      
      case 'openings':
        return jobsCopy.sort((a, b) => b.noOfOpenings - a.noOfOpenings);
      
      case 'company_name':
        return jobsCopy.sort((a, b) => a.company.name.localeCompare(b.company.name));
      
      case 'job_title':
        return jobsCopy.sort((a, b) => a.title.localeCompare(b.title));
      
      default:
        return jobsCopy;
    }
  }, [rawJobs, sortBy]);

  const quickStats = [
    {
      label: 'Total Jobs',
      value: pagination.totalCount.toLocaleString(),
      icon: Briefcase,
      color: 'blue',
      bgGradient: 'from-blue-100 to-cyan-100',
      iconBg: 'bg-blue-500'
    },
    {
      label: 'Active Openings',
      value: sortedJobs.reduce((sum, job) => sum + job.noOfOpenings, 0).toLocaleString(),
      icon: TrendingUp,
      color: 'green',
      bgGradient: 'from-green-100 to-emerald-100',
      iconBg: 'bg-green-500'
    },
    {
      label: 'Total Applications',
      value: sortedJobs.reduce((sum, job) => sum + job._count.applications, 0).toLocaleString(),
      icon: Users,
      color: 'purple',
      bgGradient: 'from-purple-100 to-violet-100',
      iconBg: 'bg-purple-500'
    },
    {
      label: 'Companies Hiring',
      value: new Set(sortedJobs.map(job => job.company.id)).size.toLocaleString(),
      icon: MapPin,
      color: 'orange',
      bgGradient: 'from-orange-100 to-amber-100',
      iconBg: 'bg-orange-500'
    }
  ];

  const sortOptions = [
    { value: 'latest', label: '🕒 Latest Jobs' },
    { value: 'salary_high', label: '💰 Highest Salary' },
    { value: 'salary_low', label: '💸 Lowest Salary' },
    { value: 'applications', label: '👥 Most Applied' },
    { value: 'openings', label: '🔥 Most Openings' },
    { value: 'company_name', label: '🏢 Company A-Z' },
    { value: 'job_title', label: '📝 Job Title A-Z' }
  ];

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Optional: Show toast notification
    const selectedOption = sortOptions.find(option => option.value === newSortBy);
    if (selectedOption) {
      // You can add a toast here if you want
      console.log(`Sorted by: ${selectedOption.label}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Job Portal
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover your next career opportunity with top companies. 
              Find jobs that match your skills and aspirations.
            </p>

            {/* Quick Search */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for jobs, companies, or skills..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          updateFilters({ search: target.value });
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      updateFilters({ search: input?.value || '' });
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce delay-500" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        {profile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {profile.user.profilePicture ? (
                    <Image
                      width={64}
                      height={64}
                      src={profile.user.profilePicture}
                      alt={profile.user.name}
                      className="w-16 h-16 rounded-2xl shadow-lg object-cover ring-4 ring-blue-500/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-blue-500/20">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back, {profile.user.name}! 👋
                  </h2>
                  <p className="text-gray-600">
                    Ready to find your next opportunity? Let&apos;s explore some amazing jobs.
                  </p>
                </div>
              </div>

              {/* <div className="flex space-x-3">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div> */}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-600 uppercase tracking-wide`}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <JobFilters onFilterChange={updateFilters} />
          </aside>

          {/* Job Listings */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pagination.totalCount > 0 ? `${pagination.totalCount} Jobs Found` : 'No Jobs Found'}
                  </h3>
                  
                  {pagination.totalCount > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Showing</span>
                      <span className="font-semibold text-blue-600">
                        {((pagination.currentPage - 1) * 10) + 1}-{Math.min(pagination.currentPage * 10, pagination.totalCount)}
                      </span>
                      <span>of</span>
                      <span className="font-semibold text-blue-600">{pagination.totalCount}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <SortDesc className="w-4 h-4 text-gray-600" />
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white shadow text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white shadow text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title="Grid View"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={refetch}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
                    title="Refresh Jobs"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Sort Info */}
              {sortBy !== 'latest' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <SortDesc className="w-4 h-4" />
                    <span>Sorted by: <strong>{sortOptions.find(opt => opt.value === sortBy)?.label}</strong></span>
                    <button
                      onClick={() => handleSortChange('latest')}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Reset to Latest
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Job Listings Container */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : 'space-y-6'}>
              <JobList jobs={sortedJobs} error={error} />
            </div>
            
            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNext}
                onPageChange={changePage} hasPrev={false}              />
            </div>

            {/* Empty State for No Jobs */}
            {pagination.totalCount === 0 && !error && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Jobs Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn&apos;t find any jobs matching your criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => updateFilters({})}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </button>
                  <button
                    onClick={refetch}
                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse All Jobs
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Featured Section */}
        {sortedJobs.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                <Star className="w-8 h-8 text-yellow-500" />
                <span>Featured Opportunities</span>
                <Star className="w-8 h-8 text-yellow-500" />
              </h3>
              <p className="text-gray-600 text-lg">
                Hand-picked opportunities from top companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sortedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  onClick={() => window.location.href = `/jobseeker/jobs/${job.id}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {job.company.profilePicture ? (
                      <Image
                        width={48}
                        height={48}
                        src={job.company.profilePicture}
                        alt={job.company.name}
                        className="w-12 h-12 rounded-lg shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg shadow-md bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600">{job.company.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{job._count.applications} applied</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Job Portal</h3>
          </div>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Connecting talented professionals with amazing opportunities. 
            Your next career adventure starts here.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>© 2025 Job Portal. All rights reserved.</span>
            <span>•</span>
            <span>Built with ❤️ for job seekers</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
