// components/profile/BasicDetailsSection.tsx
'use client';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3, CheckCircle2 } from 'lucide-react';
import { User as UserType } from './types';
import { updateBasicDetails } from './profileApi';
import BasicDetailsModal from './BasicDetailsModel';
import { promiseToast } from './toasts';


interface BasicDetailsSectionProps {
  data: UserType | null;
  onUpdate: () => void;
  isComplete: boolean;
}

const BasicDetailsSection: React.FC<BasicDetailsSectionProps> = ({ data, onUpdate, isComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleUpdate = async (formData: UserType) => {
    const updatePromise = updateBasicDetails(formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating basic details...',
      success: 'Basic details updated successfully! ✅',
      error: 'Failed to update basic details'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error is handled by promiseToast
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Array of random professional avatar GIFs as fallbacks
  const fallbackGifs = [
    'https://media.giphy.com/media/YA3ak5yulbYXy/giphy.gif', // Professional avatar
    'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif', // Developer
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', // Business person
    'https://media.giphy.com/media/13GVWlr9qVBKve/giphy.gif', // Creative professional
    'https://media.giphy.com/media/l0HlKrB02QY0f1mbm/giphy.gif', // Tech professional
  ];

  const getRandomFallbackGif = () => {
    return fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
  };

  return (
    <>
      {/* Modern Section Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Basic Details</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your personal information and contact details</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Details
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="relative">
                      {data.profilePicture && !imageError ? (
                        <img
                          src={data.profilePicture}
                          alt={`${data.name}'s profile picture`}
                          className="w-32 h-32 rounded-full ring-4 ring-blue-500/30 shadow-2xl object-cover transition-all duration-300 group-hover:ring-blue-500/50"
                          onError={handleImageError}
                        />
                      ) : (
                        <img
                          src={getRandomFallbackGif()}
                          alt="Profile avatar animation"
                          className="w-32 h-32 rounded-full ring-4 ring-purple-500/30 shadow-2xl object-cover transition-all duration-300 group-hover:ring-purple-500/50"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">{data.name}</h3>
                    <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full mt-2">
                      Job Seeker
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information Cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl shadow-md">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{data.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl shadow-md">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Email</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1 truncate">{data.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl shadow-md">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Phone</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{data.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl shadow-md">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Location</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{data.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Basic Details Found</h3>
              <p className="text-gray-600 mb-6">Please add your basic details to get started with your profile</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                Add Details
              </button>
            </div>
          )}
        </div>
      </div>

      <BasicDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        data={data}
        loading={false}
      />
    </>
  );
};

export default BasicDetailsSection;
