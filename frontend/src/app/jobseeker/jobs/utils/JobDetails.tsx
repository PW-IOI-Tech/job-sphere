'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  CheckCircle2,
  Eye,
  Briefcase,
  Star,
  X,
  Send,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Share2,
  Bookmark,
  AlertTriangle
} from 'lucide-react';
import { JobSeekerAPI } from './api';
import { Job, JobFormField } from './types';
import { JobSeekerProfile } from './types';
import { useProfile } from './useProfile';

interface JobDetailProps {
  jobId: string;
}

export const JobDetail: React.FC<JobDetailProps> = ({ jobId }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState<Record<number, string>>({});
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const router = useRouter();
  
  const { profile } = useProfile();

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const fetchJobDetail = async () => {
    try {
      const response = await JobSeekerAPI.getJobById(jobId);
      if (response.success && response.data) {
        setJob(response.data as Job);
        initializeFormData((response.data as Job).formFields || []);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  // Calculate total years of experience
  const calculateTotalExperience = (experiences: JobSeekerProfile['experience']) => {
    let totalMonths = 0;
    
    experiences.forEach(exp => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      totalMonths += diffMonths;
    });

    return Math.round(totalMonths / 12 * 10) / 10;
  };

  // Initialize form data with profile information
  const initializeFormData = (formFields: JobFormField[]) => {
    if (!profile) return;

    const initialFormData: Record<number, string> = {};
    
    formFields.forEach((field: JobFormField) => {
      let defaultValue = '';

      const fieldLabel = field.label.toLowerCase();
      
      if (fieldLabel.includes('name') || fieldLabel.includes('full name')) {
        defaultValue = profile.user.name || '';
      } else if (fieldLabel.includes('email') || field.fieldType === 'EMAIL') {
        defaultValue = profile.user.email || '';
      } else if (fieldLabel.includes('phone') || field.fieldType === 'PHONE') {
        defaultValue = profile.user.phone || '';
      } else if (fieldLabel.includes('resume') || fieldLabel.includes('cv')) {
        defaultValue = profile.resume || '';
      } else if (fieldLabel.includes('linkedin')) {
        defaultValue = profile.linkedin || '';
      } else if (fieldLabel.includes('github')) {
        defaultValue = profile.github || '';
      } else if (fieldLabel.includes('location') || fieldLabel.includes('address')) {
        defaultValue = profile.user.location || '';
      } else if (fieldLabel.includes('skill')) {
        defaultValue = profile.skills.join(', ') || '';
      } else if (fieldLabel.includes('experience') && field.fieldType === 'YEARS_OF_EXPERIENCE') {
        const totalExperience = calculateTotalExperience(profile.experience);
        defaultValue = totalExperience.toString();
      }

      initialFormData[field.id] = defaultValue;
    });

    setFormData(initialFormData);
  };

  // Re-initialize form data when profile loads
  useEffect(() => {
    if (profile && job && job.formFields) {
      initializeFormData(job.formFields);
    }
  }, [profile, job]);

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    try {
      const responses = Object.entries(formData)
        .filter(([_, value]) => value.trim() !== '')
        .map(([fieldId, answer]) => ({
          fieldId: parseInt(fieldId),
          answer: answer.trim(),
        }));

      const response = await JobSeekerAPI.applyForJob(jobId, responses);
      if (response.success) {
        fetchJobDetail();
        setShowApplicationForm(false);
      }
    } catch (err) {
      // Error handled by API utility
    } finally {
      setApplying(false);
    }
  };

  const renderFormField = (field: JobFormField) => {
    const value = formData[field.id] || '';

    const baseInputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500";

    switch (field.fieldType) {
      case 'TEXT':
      case 'EMAIL':
      case 'PHONE':
      case 'RESUME_URL':
      case 'LOCATION':
        return (
          <input
            type={getInputType(field.fieldType)}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            placeholder={getPlaceholder(field)}
            className={`${baseInputClasses} focus:ring-blue-500`}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            rows={4}
            placeholder={getPlaceholder(field)}
            className={`${baseInputClasses} focus:ring-blue-500 resize-vertical`}
          />
        );

      case 'NUMBER':
      case 'YEARS_OF_EXPERIENCE':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            min="0"
            step={field.fieldType === 'YEARS_OF_EXPERIENCE' ? '0.1' : '1'}
            placeholder={getPlaceholder(field)}
            className={`${baseInputClasses} focus:ring-green-500`}
          />
        );

      case 'SELECT':
        return (
          <select
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            className={`${baseInputClasses} focus:ring-purple-500`}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'MULTISELECT':
        return (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={value.split(',').map(v => v.trim()).includes(option)}
                  onChange={(e) => {
                    const currentValues = value ? value.split(',').map(v => v.trim()) : [];
                    if (e.target.checked) {
                      currentValues.push(option);
                    } else {
                      const index = currentValues.indexOf(option);
                      if (index > -1) currentValues.splice(index, 1);
                    }
                    setFormData(prev => ({ ...prev, [field.id]: currentValues.join(', ') }));
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'DATE':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            className={`${baseInputClasses} focus:ring-orange-500`}
          />
        );

      case 'CHECKBOX':
        return (
          <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.checked ? 'true' : 'false' }))}
              required={field.isRequired}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">{field.label}</span>
          </label>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            required={field.isRequired}
            placeholder={getPlaceholder(field)}
            className={`${baseInputClasses} focus:ring-blue-500`}
          />
        );
    }
  };

  const getInputType = (fieldType: string): string => {
    switch (fieldType) {
      case 'EMAIL': return 'email';
      case 'PHONE': return 'tel';
      case 'RESUME_URL': return 'url';
      default: return 'text';
    }
  };

  const getPlaceholder = (field: JobFormField): string => {
    switch (field.fieldType) {
      case 'EMAIL': return 'Enter your email address';
      case 'PHONE': return 'Enter your phone number';
      case 'RESUME_URL': return 'Enter your resume URL';
      case 'LOCATION': return 'Enter your location';
      case 'YEARS_OF_EXPERIENCE': return 'Enter years of experience';
      default: return `Enter ${field.label.toLowerCase()}`;
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max?.toLocaleString()}`;
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
          icon: AlertTriangle,
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

  // Show skeleton while job loads
  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isApplied = job.applications && job.applications.length > 0;
  const applicationStatus = isApplied ? job.applications?.[0]?.status : null;
  const statusConfig = applicationStatus ? getStatusConfig(applicationStatus) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        {/* Main Job Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Company Logo */}
                <div className="relative">
                  {job.company.profilePicture ? (
                    <Image
                      width={96}
                      height={96}
                      src={job.company.profilePicture}
                      alt={job.company.name}
                      className="w-24 h-24 rounded-2xl shadow-lg object-cover ring-4 ring-blue-500/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-blue-500/20">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Job & Company Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <h2 className="text-xl text-gray-700 mb-3 font-semibold">{job.company.name}</h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    {job.company.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.company.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.jobType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.role.replace(/_/g, ' ')}</span>
                    </div>
                    {job.company.industry && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company.industry}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Application Status */}
            {isApplied && statusConfig && (
              <div className={`${statusConfig.bg} ${statusConfig.text} mt-6 p-4 rounded-xl border border-white/30`}>
                <div className="flex items-center space-x-3">
                  {StatusIcon && <StatusIcon className="w-6 h-6" />}
                  <div>
                    <h3 className="font-bold text-lg">Application Status: {statusConfig.label}</h3>
                    <p className="text-sm opacity-80">
                      Applied on {new Date(job.applications![0].appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Stats Grid */}
          <div className="p-8 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Salary</p>
                    <p className="text-lg font-bold text-gray-900">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Openings</p>
                    <p className="text-lg font-bold text-gray-900">{job.noOfOpenings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Applicants</p>
                    <p className="text-lg font-bold text-gray-900">{job._count.applications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Posted</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <span>Job Description</span>
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </div>
                  </div>
                </section>

                {/* Requirements */}
                {job.requirements && (
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <span>Requirements</span>
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {job.requirements}
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Apply Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-6 sticky top-6">
                  <div className="text-center">
                    {!isApplied ? (
                      <>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Ready to Apply?</h4>
                        <p className="text-gray-600 mb-6">Join this amazing team and take your career to the next level.</p>
                        
                        {profile ? (
                          <button
                            onClick={() => setShowApplicationForm(true)}
                            className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Send className="w-5 h-5 mr-2" />
                            Apply Now
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <button
                              disabled
                              className="w-full px-6 py-4 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed font-bold text-lg"
                            >
                              Complete Profile to Apply
                            </button>
                            <p className="text-sm text-gray-500">
                              Please complete your profile to apply for jobs
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Application Submitted</h4>
                        <p className="text-gray-600">Your application is being reviewed by the employer.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Info Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <span>About Company</span>
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company.name}</span>
                    </div>
                    
                    {job.company.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.company.location}</span>
                      </div>
                    )}
                    
                    {job.company.industry && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.company.industry}</span>
                      </div>
                    )}
                    
                    {job.company.size && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.company.size.replace('_', ' ')}</span>
                      </div>
                    )}

                    {job.company.website && (
                      <a 
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Company Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && profile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h3>
                    <p className="text-gray-600">at {job.company.name}</p>
                  </div>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Profile Preview */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Your Profile Information</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-900">{profile.user.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900 truncate">{profile.user.email}</span>
                  </div>
                  
                  {profile.user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-900">{profile.user.phone}</span>
                    </div>
                  )}
                  
                  {profile.user.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="text-gray-900">{profile.user.location}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-3 italic">
                  Fields below will be auto-populated with your profile data. You can edit them before submitting.
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="space-y-6">
                  {job.formFields?.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label} 
                        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    disabled={applying}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50"
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
