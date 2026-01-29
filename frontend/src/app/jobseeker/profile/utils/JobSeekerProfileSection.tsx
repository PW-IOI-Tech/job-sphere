// components/profile/JobSeekerProfileSection.tsx
'use client';
import { useState } from 'react';
import { FileText, Github, Linkedin, Zap, Edit3, CheckCircle2, ExternalLink, User, AlertCircle, Lock, Plus } from 'lucide-react';
import { saveJobSeekerProfile } from './profileApi';
import JobSeekerProfileModal from './JobSeekerProfileModel';
import { promiseToast } from './toasts';
import { JobSeekerProfileFormData } from './types';

interface JobSeekerProfileSectionProps {
  data: JobSeekerProfileFormData | null;
  onUpdate: () => void;
  isComplete: boolean;
  profileExists: boolean;
  canAccess: boolean;
}

const JobSeekerProfileSection: React.FC<JobSeekerProfileSectionProps> = ({ 
  data, 
  onUpdate, 
  isComplete, 
  profileExists, 
  canAccess 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (formData: JobSeekerProfileFormData) => {
    const savePromise = saveJobSeekerProfile(formData, profileExists);
    
    promiseToast(savePromise, {
      loading: profileExists ? 'Updating profile...' : 'Creating profile...',
      success: profileExists ? 'Profile updated successfully! 👤' : 'Profile created successfully! 🎉',
      error: profileExists ? 'Failed to update profile' : 'Failed to create profile'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  // If user can't access this section
  if (!canAccess) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-500">Job Profile</h2>
                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Locked</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">Complete your basic details first to unlock this section</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Content */}
        <div className="p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Section Locked</h3>
            <p className="text-gray-500 mb-6">Please complete your basic details first to access your professional profile section</p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              Complete Basic Details Required
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Section Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Job Profile</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                  {!profileExists && (
                    <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                      <Plus className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">New</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your professional links and skills showcase</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {profileExists ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {profileExists && data ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professional Links Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-gray-600" />
                  Professional Links
                </h3>

                {/* Resume Card */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Resume</p>
                      {data.resume ? (
                        <a 
                          href={data.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors mt-1"
                        >
                          View Resume
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No resume uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* LinkedIn Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-md">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">LinkedIn</p>
                      {data.linkedin ? (
                        <a 
                          href={data.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mt-1 truncate"
                        >
                          LinkedIn Profile
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No LinkedIn profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* GitHub Card */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl shadow-md">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">GitHub</p>
                      {data.github ? (
                        <a 
                          href={data.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors mt-1 truncate"
                        >
                          GitHub Profile
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No GitHub profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-gray-600" />
                  Skills & Expertise
                </h3>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 min-h-[300px]">
                  {data.skills && data.skills.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                          Technical Skills ({data.skills.length})
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {data.skills.map((skill: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-emerald-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Skills Added</h4>
                      <p className="text-gray-500 text-sm">Add your technical skills to showcase your expertise</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {profileExists ? 'No Profile Information' : 'Create Your Professional Profile'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {profileExists 
                  ? 'Please add your professional links and skills to complete your profile'
                  : 'Add your resume, LinkedIn, GitHub, and skills to create your professional profile and unlock additional sections'
                }
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {profileExists ? 'Add Profile Details' : 'Create Professional Profile'}
              </button>
              
              {!profileExists && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-800 mb-1">Next Step</p>
                      <p className="text-sm text-blue-700">
                        Creating your professional profile will unlock the Education, Experience, Projects, and Preferences sections.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <JobSeekerProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        data={data}
        loading={false}
        isCreating={!profileExists}
      />
    </>
  );
};

export default JobSeekerProfileSection;
