import React from 'react';
import { Eye, Trash2, MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Application } from './types';

interface ApplicationCardProps {
  application: Application;
  onViewDetails: (applicationId: number) => void;
  onWithdraw?: (applicationId: number) => void;
  withdrawLoading?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onViewDetails, 
  onWithdraw,
  withdrawLoading = false
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      REVIEWING: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      SHORTLISTED: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      INTERVIEWED: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      ACCEPTED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      WITHDRAWN: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canWithdraw = (status: string) => {
    return !['WITHDRAWN', 'ACCEPTED', 'REJECTED'].includes(status);
  };

  const handleWithdraw = () => {
    toast('Are you sure you want to withdraw this application?', {
      duration: Infinity,
      action: {
        label: 'Yes, withdraw',
        onClick: () => {
          if (onWithdraw) {
            onWithdraw(application.id);
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.dismiss()
      }
    });
  };

  const statusColors = getStatusColor(application.status);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {/* Job Title and Company */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {application.job.title}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-500" />
                <p className="text-lg text-gray-700 font-medium">{application.job.company.name}</p>
              </div>
            </div>
            
            {/* Job Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{application.job.location || 'Remote'}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{application.job.jobType.replace('_', ' ')}</span>
              </div>
              
              {application.job.salaryMin && application.job.salaryMax && (
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    ${application.job.salaryMin}k - ${application.job.salaryMax}k
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-xl border ${statusColors.bg} ${statusColors.text} ${statusColors.border} font-medium text-sm shadow-sm`}>
            {application.status.replace('_', ' ')}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Applied on {formatDate(application.appliedAt)}</span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails(application.id)}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>
            
            {onWithdraw && canWithdraw(application.status) && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {withdrawLoading ? 'Withdrawing...' : 'Withdraw'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
