import React, { useState } from 'react';
import { Filter, Calendar, RotateCcw, Search } from 'lucide-react';
import { Filters } from './types'; 

interface ApplicationFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onClearFilters: () => void;
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  onFilterChange,
  onClearFilters
}) => {
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilters = () => {
    const filters: Filters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    onClearFilters();
  };

  const statusOptions = [
    { value: '', label: 'All Status', color: 'gray' },
    { value: 'PENDING', label: 'Pending', color: 'yellow' },
    { value: 'REVIEWING', label: 'Reviewing', color: 'blue' },
    { value: 'SHORTLISTED', label: 'Shortlisted', color: 'teal' },
    { value: 'INTERVIEWED', label: 'Interviewed', color: 'indigo' },
    { value: 'ACCEPTED', label: 'Accepted', color: 'green' },
    { value: 'REJECTED', label: 'Rejected', color: 'red' },
    { value: 'WITHDRAWN', label: 'Withdrawn', color: 'gray' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Filter Applications</h3>
            <p className="text-gray-600 text-sm mt-1">Refine your application history view</p>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Search className="w-4 h-4 text-purple-500" />
              <span>Status</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 font-medium"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium"
            />
          </div>

          {/* End Date Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end space-y-3">
            <button
              onClick={handleApplyFilters}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
