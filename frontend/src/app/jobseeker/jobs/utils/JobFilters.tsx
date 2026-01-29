'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Search, 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign, 
  Filter,
  X,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { JobFilters as JobFiltersType } from './types';

interface JobFiltersProps {
  onFilterChange: (filters: Partial<JobFiltersType>) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    jobType: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
  });

  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      role: '',
      jobType: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    toast.success('Filters cleared successfully!');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const jobRoles = [
    { value: 'SOFTWARE_ENGINEER', label: 'Software Engineer' },
    { value: 'FRONTEND_DEVELOPER', label: 'Frontend Developer' },
    { value: 'BACKEND_DEVELOPER', label: 'Backend Developer' },
    { value: 'FULLSTACK_DEVELOPER', label: 'Fullstack Developer' },
    { value: 'DATA_SCIENTIST', label: 'Data Scientist' },
    { value: 'DATA_ANALYST', label: 'Data Analyst' },
    { value: 'DEVOPS_ENGINEER', label: 'DevOps Engineer' },
    { value: 'MOBILE_DEVELOPER', label: 'Mobile Developer' },
    { value: 'UI_UX_DESIGNER', label: 'UI/UX Designer' },
    { value: 'PRODUCT_MANAGER', label: 'Product Manager' },
    { value: 'PROJECT_MANAGER', label: 'Project Manager' },
    { value: 'QA_ENGINEER', label: 'QA Engineer' },
  ];

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'CONTRACT', label: 'Contract' },
  ];

  const popularLocations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Gurgaon',
    'Noida',
    'Remote'
  ];

  return (
    <div className="sticky top-6">
      {/* Filter Header Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filter Jobs</h3>
                <p className="text-sm text-gray-600">Find your perfect match</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {getActiveFilterCount()} active
                </div>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
              >
                <Sliders className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-0' : 'rotate-90'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Search className="w-4 h-4 text-blue-500" />
                <span>Search Jobs</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Job Role Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Briefcase className="w-4 h-4 text-green-500" />
                <span>Job Role</span>
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="">All Roles</option>
                {jobRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Job Type</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {jobTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('jobType', filters.jobType === type.value ? '' : type.value)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2
                      ${filters.jobType === type.value
                        ? 'bg-gradient-to-r from-purple-100 to-violet-100 border-purple-300 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Location</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  list="locations"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <datalist id="locations">
                  {popularLocations.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
              
              {/* Popular Locations */}
              <div className="flex flex-wrap gap-1 mt-2">
                {popularLocations.slice(0, 6).map((location) => (
                  <button
                    key={location}
                    onClick={() => handleFilterChange('location', location)}
                    className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors duration-200"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Salary Range (₹ per year)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Minimum</label>
                  <input
                    type="number"
                    placeholder="Min salary"
                    value={filters.salaryMin}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Maximum</label>
                  <input
                    type="number"
                    placeholder="Max salary"
                    value={filters.salaryMax}
                    onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
              </div>
              
              {/* Quick Salary Filters */}
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  { min: '300000', max: '600000', label: '3-6L' },
                  { min: '600000', max: '1000000', label: '6-10L' },
                  { min: '1000000', max: '1500000', label: '10-15L' },
                  { min: '1500000', max: '', label: '15L+' },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      handleFilterChange('salaryMin', range.min);
                      handleFilterChange('salaryMax', range.max);
                    }}
                    className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors duration-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        {isExpanded && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
            <div className="flex space-x-3">
              <button
                onClick={resetFilters}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
              <button
                onClick={() => {
                  const activeFilters = Object.entries(filters).filter(([ value]) => value !== '');
                  toast.success(`${activeFilters.length} filter${activeFilters.length !== 1 ? 's' : ''} applied`);
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Active Filters</h4>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === '') return null;
                
                const getFilterLabel = (key: string, value: string) => {
                  switch (key) {
                    case 'search': return `"${value}"`;
                    case 'role': return jobRoles.find(r => r.value === value)?.label || value;
                    case 'jobType': return jobTypes.find(t => t.value === value)?.label || value;
                    case 'location': return value;
                    case 'salaryMin': return `Min: ₹${parseInt(value).toLocaleString()}`;
                    case 'salaryMax': return `Max: ₹${parseInt(value).toLocaleString()}`;
                    default: return value;
                  }
                };

                return (
                  <div
                    key={key}
                    className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                  >
                    <span>{getFilterLabel(key, value)}</span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
