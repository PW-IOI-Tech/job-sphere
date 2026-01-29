// components/profile/JobSeekerProfile.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchProfileData, fetchProfileStatus } from './utils/profileApi';
import { ProfileStatus, JobSeekerProfileData,User } from './utils/types';
import BasicDetailsSection from './utils/BasicDetailsSection';
import JobSeekerProfileSection from './utils/JobSeekerProfileSection';
import EducationSection from './utils/EducationSection';
import ExperienceSection from './utils/ExperienceSection';
import ProjectsSection from './utils/ProjectSection';
import PreferencesSection from './utils/PreferencesSection';
import { toast } from 'sonner';



export function JobSeekerProfile() {
  const [profileData, setProfileData] = useState<JobSeekerProfileData | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);
  const [jobSeekerProfileExists, setJobSeekerProfileExists] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null); // Basic user data from status API

  // Add refs for each section
  const basicDetailsRef = useRef<HTMLDivElement>(null);
  const professionalProfileRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      setTimeout(() => {
        ref.current?.focus();
      }, 500);
    }
  };

  const loadProfileData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setIsFirstTimeUser(false);
    setJobSeekerProfileExists(false);

    const fetchPromise = Promise.all([
      fetchProfileData(),
      fetchProfileStatus()
    ]);

    toast.promise(fetchPromise, {
      loading: 'Loading your profile...',
      success: ([profileResponse, statusResponse]) => {
        // Handle profile status response first (always available for authenticated users)
        if (statusResponse.success) {
          setProfileStatus(statusResponse.data.profileStatus);
          setUserData(statusResponse.data.user as User); // Store basic user data
          
          const completionPercentage = statusResponse.data.profileStatus.completionPercentage;
          
          // Show completion status as separate toast
          setTimeout(() => {
            if (completionPercentage === 100) {
              toast.success('Profile Complete! 🎉', {
                description: 'Your profile is now ready for job applications.'
              });
            } else if (completionPercentage >= 75) {
              toast.info('Almost There! 📝', {
                description: `Profile is ${completionPercentage}% complete. Just a few more sections to go.`
              });
            } else if (completionPercentage >= 50) {
              toast.info('Good Progress! 👍', {
                description: `Profile is ${completionPercentage}% complete. Keep going!`
              });
            } else if (completionPercentage > 0) {
              toast.info('Getting Started! 🚀', {
                description: `Profile is ${completionPercentage}% complete. Let's continue building your profile.`
              });
            } else {
              toast.info('Welcome! ✨', {
                description: 'Let\'s build your professional profile step by step.'
              });
            }
          }, 500);
        }

        // Handle job seeker profile data response
        if (profileResponse.success && profileResponse.data && Object.keys(profileResponse.data).length > 0) {
          setProfileData(profileResponse.data);
          setJobSeekerProfileExists(true);
          setIsFirstTimeUser(false);
        } else if (profileResponse.message === "Job seeker profile not found") {
          // Job seeker profile doesn't exist yet, but user is authenticated
          setProfileData(null);
          setJobSeekerProfileExists(false);
          
          // Check if this is truly a first-time user (no basic details completed)
          const isNewUser = !statusResponse.data?.profileStatus?.basicDetails;
          setIsFirstTimeUser(isNewUser);
        }

        // Set default profile status for users without job seeker profile
        if (!statusResponse.success || statusResponse.message === "Job seeker profile not found") {
          setProfileStatus({
            completionPercentage: 0,
            sectionsCompleted: 0,
            totalSections: 6,
            basicDetails: false,
            jobSeekerProfile: false,
            education: false,
            experience: false,
            projects: false,
            preferences: false,
            nextStep: 'Complete your basic details',
            isComplete: false
          });
          setIsFirstTimeUser(true);
        }

        setLoading(false);
        
        if (profileResponse.message === "Job seeker profile not found") {
          return 'Welcome! Let\'s build your professional profile ✨';
        }
        return 'Profile loaded successfully! ✨';
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        
        const errorMessage = error?.response?.data?.message || 'Failed to load profile data. Please try again.';
        setError(errorMessage);
        setLoading(false);
        return errorMessage;
      }
    });
  };

  // Determine if user has any basic details completed
  const hasBasicDetails = () => {
    return profileStatus?.basicDetails || false;
  };

  // First-time user or incomplete basic details welcome screen
  if ((isFirstTimeUser || !hasBasicDetails()) && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Welcome Header */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                {hasBasicDetails() ? 'Continue Building Your Profile! 🚀' : 'Welcome to Your Professional Journey! 🚀'}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                {hasBasicDetails() 
                  ? 'Great start! Now let\'s complete your professional profile to maximize your job opportunities.'
                  : 'Let\'s build an amazing profile that showcases your skills, experience, and aspirations. Start with your basic details below.'
                }
              </p>
              
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 inline-block">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-2xl font-bold text-purple-600">{profileStatus?.completionPercentage || 0}%</span>
                </div>
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${profileStatus?.completionPercentage || 0}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{profileStatus?.sectionsCompleted || 0} of {profileStatus?.totalSections || 6} sections completed</p>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              {hasBasicDetails() ? 'Continue Your Profile' : 'Let\'s Get Started'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {hasBasicDetails() 
                ? 'Click on any section below to continue building your professional profile!'
                : 'Start by completing your basic details, then move on to other sections to build your complete profile!'
              }
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { 
                  title: "Basic Details", 
                  desc: "Name, phone, location & profile picture", 
                  icon: "👤",
                  ref: basicDetailsRef,
                  completed: profileStatus?.basicDetails || false,
                  priority: true
                },
                { 
                  title: "Professional Profile", 
                  desc: "Resume, LinkedIn, GitHub & skills", 
                  icon: "💼",
                  ref: professionalProfileRef,
                  completed: profileStatus?.jobSeekerProfile || false,
                  disabled: !hasBasicDetails()
                },
                { 
                  title: "Education", 
                  desc: "Your academic background", 
                  icon: "🎓",
                  ref: educationRef,
                  completed: profileStatus?.education || false,
                  disabled: !jobSeekerProfileExists
                },
                { 
                  title: "Experience", 
                  desc: "Work history and achievements", 
                  icon: "🏢",
                  ref: experienceRef,
                  completed: profileStatus?.experience || false,
                  disabled: !jobSeekerProfileExists
                },
                { 
                  title: "Projects", 
                  desc: "Showcase your work and projects", 
                  icon: "🚀",
                  ref: projectsRef,
                  completed: profileStatus?.projects || false,
                  disabled: !jobSeekerProfileExists
                },
                { 
                  title: "Preferences", 
                  desc: "Job preferences and salary expectations", 
                  icon: "⚙️",
                  ref: preferencesRef,
                  completed: profileStatus?.preferences || false,
                  disabled: !jobSeekerProfileExists
                }
              ].map((section, index) => (
                <button
                  key={index}
                  onClick={() => !section.disabled && scrollToSection(section.ref as React.RefObject<HTMLDivElement>)}
                  disabled={section.disabled}
                  className={`rounded-xl p-4 border transition-all duration-300 text-left w-full group ${
                    section.disabled 
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
                      : section.completed 
                        ? 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-md transform hover:scale-105 ring-2 ring-green-200' 
                        : section.priority 
                          ? 'bg-blue-50 border-blue-300 hover:border-blue-400 hover:shadow-md transform hover:scale-105 ring-2 ring-blue-200'
                          : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105'
                  }`}
                  aria-label={section.disabled ? `${section.title} (Complete basic details first)` : `Go to ${section.title} section`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-2xl transition-transform duration-200 ${!section.disabled ? 'group-hover:scale-110' : ''}`}>
                        {section.icon}
                      </span>
                      <div>
                        <h3 className={`font-semibold transition-colors ${
                          section.disabled 
                            ? 'text-gray-500' 
                            : section.completed 
                              ? 'text-green-800' 
                              : section.priority 
                                ? 'text-blue-800 group-hover:text-blue-900'
                                : 'text-gray-800 group-hover:text-blue-700'
                        }`}>
                          {section.title}
                          {section.priority && !section.completed && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Start Here</span>
                          )}
                        </h3>
                        <p className={`text-sm ${section.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                          {section.disabled ? 'Complete previous sections first' : section.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {section.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-6 h-6 border-2 rounded-full transition-colors ${
                          section.disabled 
                            ? 'border-gray-300' 
                            : 'border-gray-300 group-hover:border-blue-400'
                        }`}></div>
                      )}
                      {!section.disabled && (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {hasBasicDetails() 
                ? 'Continue where you left off or jump to any section above! 👆' 
                : 'Ready to get started? Begin with your basic details below! 👇'
              }
            </p>
          </div>
        </div>
        
        {/* Profile Sections Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
          <div ref={basicDetailsRef} tabIndex={-1} className="scroll-mt-8">
            <BasicDetailsSection 
              data={userData || null}
              onUpdate={loadProfileData}
              isComplete={profileStatus?.basicDetails || false}
            />
          </div>

          <div ref={professionalProfileRef} tabIndex={-1} className="scroll-mt-8">
            <JobSeekerProfileSection 
              data={profileData} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.jobSeekerProfile || false}
              profileExists={jobSeekerProfileExists}
              canAccess={hasBasicDetails()}
            />
          </div>

          <div ref={educationRef} tabIndex={-1} className="scroll-mt-8">
            <EducationSection 
              data={profileData?.education || []} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.education || false}
              canAccess={jobSeekerProfileExists}
            />
          </div>

          <div ref={experienceRef} tabIndex={-1} className="scroll-mt-8">
            <ExperienceSection 
              data={profileData?.experience || []} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.experience || false}
              canAccess={jobSeekerProfileExists}
            />
          </div>

          <div ref={projectsRef} tabIndex={-1} className="scroll-mt-8">
            <ProjectsSection 
              data={profileData?.projects || []} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.projects || false}
              canAccess={jobSeekerProfileExists}
            />
          </div>

          <div ref={preferencesRef} tabIndex={-1} className="scroll-mt-8">
            <PreferencesSection 
              data={profileData?.preferences || null} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.preferences || false}
              canAccess={jobSeekerProfileExists}
            />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isFirstTimeUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadProfileData}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main profile interface for existing users with completed basic details
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Job Seeker Profile
                </h1>
                <p className="text-gray-600 text-lg">Build your professional story and get noticed by employers</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 min-w-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {profileStatus?.completionPercentage || 0}%
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-sm ${loading ? 'animate-pulse' : ''}`}
                    style={{ width: `${profileStatus?.completionPercentage || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {profileStatus?.sectionsCompleted || 0} of {profileStatus?.totalSections || 6} sections
                  </span>
                  <span className="text-purple-600 font-medium">
                    {(profileStatus?.completionPercentage || 0) === 100 ? '🎉 Complete!' : '📝 In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections Container */}
        <div className="space-y-8">
          <BasicDetailsSection 
            data={userData || profileData?.user || null}
            onUpdate={loadProfileData}
            isComplete={profileStatus?.basicDetails || false}
          />

          <JobSeekerProfileSection 
            data={profileData} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.jobSeekerProfile || false}
            profileExists={jobSeekerProfileExists}
            canAccess={hasBasicDetails()}
          />

          <EducationSection 
            data={profileData?.education || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.education || false}
            canAccess={jobSeekerProfileExists}
          />

          <ExperienceSection 
            data={profileData?.experience || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.experience || false}
            canAccess={jobSeekerProfileExists}
          />

          <ProjectsSection 
            data={profileData?.projects || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.projects || false}
            canAccess={jobSeekerProfileExists}
          />

          <PreferencesSection 
            data={profileData?.preferences || null} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.preferences || false}
            canAccess={jobSeekerProfileExists}
          />
        </div>
      </div>
    </div>
  );
}
