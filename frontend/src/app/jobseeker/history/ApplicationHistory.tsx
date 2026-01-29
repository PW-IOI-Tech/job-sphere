import React, { useState, useEffect } from 'react';
import { History, FileText, RefreshCw, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useApplicationHistory, useWithdrawApplication } from './utils/useApplicationHIstory';
import ApplicationStats from './utils/ApplicationStats';
import ApplicationFilters from './utils/ApplicationFilters';
import ApplicationCard from './utils/ApplicationCard';
import ApplicationListSkeleton from './utils/ApplicationListSkleton';
import { Filters, Application, Pagination } from './utils/types';

const ApplicationHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({});
  // Fixed: selectedApplication should be Application type, not ApplicationHistoryResponse
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);


  const { applications, loading, pagination, fetchApplicationHistory } = useApplicationHistory() as {
    applications: Application[];
    loading: boolean;
    pagination: Pagination;
    fetchApplicationHistory: (page: number, pageSize: number, filters: Filters) => void;
  };
  
  const { withdrawApplication, loading: withdrawLoading } = useWithdrawApplication();

  useEffect(() => {
    fetchApplicationHistory(currentPage, 10, filters);
  }, [currentPage, filters, fetchApplicationHistory]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    const activeFilters = Object.keys(newFilters).filter(key => 
      newFilters[key as keyof Filters]
    );
    if (activeFilters.length > 0) {
      toast.success(`Filters applied: ${activeFilters.join(', ')}`, {
        duration: 2000,
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    toast.success('All filters cleared', {
      duration: 2000,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = async (applicationId: number) => {
    const loadingToastId = toast.loading('Loading application details...');
    
    try {
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        setSelectedApplication(application);
        toast.dismiss(loadingToastId);
        toast.success('Application details loaded', {
          duration: 1500,
        });
      } else {
        toast.dismiss(loadingToastId);
        toast.error('Application not found');
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to load application details');
    }
  };

  const handleWithdrawApplication = async (applicationId: number) => {
    try {
      await withdrawApplication(applicationId);
      fetchApplicationHistory(currentPage, 10, filters);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  // Show skeleton on initial load
  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex justify-between items-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded-md w-64 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded-md w-32"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded-md w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <ApplicationStats />
          <ApplicationFilters onFilterChange={() => {}} onClearFilters={() => {}} />
          <ApplicationListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Application History</h1>
                  <p className="text-gray-600 text-sm mt-1">Track and manage all your job applications</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fetchApplicationHistory(currentPage, 10, filters)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                  <span className="font-medium">Total: {pagination?.total || applications.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ApplicationStats />
        <ApplicationFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        {loading && applications.length > 0 && (
          <div className="mb-8">
            <ApplicationListSkeleton count={3} />
          </div>
        )}
        
        <div className="space-y-6">
          {applications.length === 0 && !loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="text-center py-16 px-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or apply to more jobs</p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
                onWithdraw={handleWithdrawApplication}
                withdrawLoading={withdrawLoading}
              />
            ))
          )}
        </div>
        
        {/* Fixed: Added proper type checking for pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-4 py-2 bg-white rounded-lg border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="px-4 py-2 bg-white rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        
        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto shadow-2xl border border-white/20">
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                      <p className="text-gray-600 text-sm">Complete information about your application</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Job Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl shadow-md">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedApplication.job.title}</h3>
                      <p className="text-lg text-gray-700 font-medium mb-3">{selectedApplication.job.company.name}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                          📍 {selectedApplication.job.location || 'Remote'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                          💼 {selectedApplication.job.jobType.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                          🏷️ {selectedApplication.job.role.replace('_', ' ')}
                        </span>
                        {selectedApplication.job.salaryMin && selectedApplication.job.salaryMax && (
                          <span className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                            💰 ${selectedApplication.job.salaryMin}k - ${selectedApplication.job.salaryMax}k
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Application Status and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">Status</h4>
                    <p className="text-lg font-bold text-gray-900">{selectedApplication.status.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-2">Applied On</h4>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Job Description */}
                {selectedApplication.job.description && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">Job Description</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedApplication.job.description}</p>
                    </div>
                  </div>
                )}
                
                {/* Application Responses */}
                {selectedApplication.responses && selectedApplication.responses.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Application Responses</h4>
                    <div className="space-y-4">
                      {selectedApplication.responses.map((response) => (
                        <div key={response.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                          <h5 className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">{response.field.label}</h5>
                          <p className="text-gray-900 font-medium">{response.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistory;
