import React, { useState, useCallback } from 'react';
import { FiSearch, FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSearch,
  onReset,
  isLoading = false,
  totalResults = 0,
  currentPage = 1,
  totalPages = 1
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(localSearchTerm);
      onSearch();
    }
  };

  const handleSearchClick = () => {
    setSearchTerm(localSearchTerm);
    onSearch();
  };

  const handleReset = useCallback(() => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setStatusFilter('All Status');
    if (onReset) {
      onReset();
    }
  }, [setSearchTerm, setStatusFilter, onReset]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    // Auto-trigger search when status changes
    setTimeout(() => onSearch(), 100);
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'All Status';

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FiSearch className="text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Search & Filter</h3>
        {isLoading && (
          <div className="ml-auto">
            <FiRefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search by title, role, description..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {localSearchTerm && (
              <button
                onClick={() => {
                  setLocalSearchTerm('');
                  setSearchTerm('');
                  onSearch();
                }}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          {localSearchTerm !== searchTerm && localSearchTerm && (
            <p className="text-xs text-blue-600 mt-1">
              Press Enter or click Search to apply
            </p>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Status
          </label>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active Jobs</option>
              <option value="PAUSED">Paused Jobs</option>
              <option value="COMPLETED">Completed Jobs</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSearchClick}
            disabled={isLoading || localSearchTerm === searchTerm}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="w-4 h-4" />
                Search Jobs
              </>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Search Results:</span>
                <span className="text-blue-600 font-semibold">
                  {totalResults} job{totalResults !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {totalPages > 1 && (
                <div className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <span>Search: &quot;{searchTerm}&quot;</span>
                    <button
                      onClick={() => {
                        setLocalSearchTerm('');
                        setSearchTerm('');
                        onSearch();
                      }}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {statusFilter !== 'All Status' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <span>Status: {statusFilter.toLowerCase()}</span>
                    <button
                      onClick={() => handleStatusChange('All Status')}
                      className="ml-1 hover:text-green-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {hasActiveFilters && totalResults === 0 && !isLoading && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FiSearch className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No jobs found</p>
              <p className="text-xs text-gray-600 mb-3">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
