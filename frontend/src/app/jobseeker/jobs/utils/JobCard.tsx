'use client';
import { Job } from './types';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  CheckCircle2,
  Eye,
  Briefcase,
  Star
} from 'lucide-react';
import Image from 'next/image';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const isApplied = job.applications && job.applications.length > 0;
  const applicationStatus = isApplied ? job.applications?.[0]?.status : null;

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max?.toLocaleString()}`;
  };

  const formatCompanySize = (size?: string) => {
    if (!size) return '';
    
    switch (size) {
      case 'STARTUP_1_10':
        return '1-10 employees';
      case 'SMALL_11_50':
        return '11-50 employees';
      case 'MEDIUM_51_200':
        return '51-200 employees';
      case 'LARGE_201_1000':
        return '201-1000 employees';
      case 'ENTERPRISE_1000_PLUS':
        return '1000+ employees';
      default:
        return size.replace(/_/g, ' ').toLowerCase();
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': 
        return { 
          bg: 'bg-gradient-to-r from-yellow-100 to-amber-100', 
          text: 'text-yellow-700',
          icon: Clock,
          label: 'Under Review'
        };
      case 'REVIEWING': 
        return { 
          bg: 'bg-gradient-to-r from-blue-100 to-cyan-100', 
          text: 'text-blue-700',
          icon: Eye,
          label: 'Reviewing'
        };
      case 'SHORTLISTED': 
        return { 
          bg: 'bg-gradient-to-r from-green-100 to-emerald-100', 
          text: 'text-green-700',
          icon: Star,
          label: 'Shortlisted'
        };
      case 'INTERVIEWED': 
        return { 
          bg: 'bg-gradient-to-r from-purple-100 to-violet-100', 
          text: 'text-purple-700',
          icon: Users,
          label: 'Interviewed'
        };
      case 'ACCEPTED': 
        return { 
          bg: 'bg-gradient-to-r from-green-100 to-emerald-100', 
          text: 'text-green-700',
          icon: CheckCircle2,
          label: 'Accepted'
        };
      case 'REJECTED': 
        return { 
          bg: 'bg-gradient-to-r from-red-100 to-rose-100', 
          text: 'text-red-700',
          icon: Clock,
          label: 'Not Selected'
        };
      default: 
        return { 
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100', 
          text: 'text-gray-700',
          icon: Clock,
          label: status
        };
    }
  };

  const statusConfig = applicationStatus ? getStatusConfig(applicationStatus) : null;
  const StatusIcon = statusConfig?.icon;

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
      {/* Application Status Badge */}
      {isApplied && statusConfig && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`${statusConfig.bg} ${statusConfig.text} px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-white/30`}>
            <div className="flex items-center space-x-2">
              {StatusIcon && <StatusIcon className="w-4 h-4" />}
              <span className="text-xs font-bold uppercase tracking-wide">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Company Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative group/avatar">
            {job.company.profilePicture ? (
              <Image
                width={64}
                height={64}
                src={job.company.profilePicture}
                alt={job.company.name}
                className="w-16 h-16 rounded-2xl shadow-lg object-cover ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {job.company.name}
              </h4>
              {job.company.industry && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                  {job.company.industry}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {job.company.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.company.location}</span>
                </div>
              )}
              {job.company.size && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{formatCompanySize(job.company.size)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Title */}
        <Link href={`/jobseeker/jobs/${job.id}`} className="block group/title">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover/title:text-blue-600 transition-colors duration-200 leading-tight">
            {job.title}
          </h3>
        </Link>

        {/* Job Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium border border-blue-200">
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{formatRole(job.role)}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-2 rounded-xl text-sm font-medium border border-green-200">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatJobType(job.jobType)}</span>
            </div>
          </div>
          
          {job.location && (
            <div className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-3 py-2 rounded-xl text-sm font-medium border border-purple-200">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed line-clamp-3 text-sm">
            {job.description}
          </p>
        </div>

        {/* Job Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col space-y-2">
            {/* Salary */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg shadow-md">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
            </div>

            {/* Job Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{job.noOfOpenings} opening{job.noOfOpenings > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-end space-y-2">
            <Link href={`/jobseeker/jobs/${job.id}`}>
              <button className={`
                px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105
                ${isApplied 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                }
              `}>
                {isApplied ? 'View Application' : 'View Details & Apply'}
              </button>
            </Link>
            
            {/* Posted Date */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
};
