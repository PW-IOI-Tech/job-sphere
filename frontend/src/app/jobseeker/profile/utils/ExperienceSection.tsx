// components/profile/ExperienceSection.tsx
'use client';
import { useState } from 'react';
import { Briefcase, Plus, Edit3, Trash2, CheckCircle2, Calendar, MapPin, Clock, Building2, Lock, AlertCircle } from 'lucide-react';
import { Experience , ExperienceFormData} from './types';
import { addExperience, updateExperience, deleteExperience } from './profileApi';
import ExperienceModal from './ExperienceModel';
import { promiseToast, showActionToast } from './toasts';


interface ExperienceSectionProps {
  data: Experience[];
  onUpdate: () => void;
  isComplete: boolean;
  canAccess: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  data, 
  onUpdate, 
  isComplete, 
  canAccess 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const handleAdd = async (formData: ExperienceFormData) => {
    const addPromise = addExperience(formData);
    
    promiseToast(addPromise, {
      loading: 'Adding experience...',
      success: 'Work experience added successfully! 💼',
      error: 'Failed to add experience'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error is handled by promiseToast
    });
  };

  const handleUpdate = async (formData: ExperienceFormData) => {
    if (!editingExperience) return;
    
    const updatePromise = updateExperience(editingExperience.id, formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating experience...',
      success: 'Work experience updated successfully! ✅',
      error: 'Failed to update experience'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
      setEditingExperience(null);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  const handleDelete = async (id: number) => {
    showActionToast(
      'Delete Experience',
      'Confirm',
      async () => {
        const deletePromise = deleteExperience(id);
        promiseToast(deletePromise, {
          loading: 'Deleting experience...',
          success: 'Experience deleted successfully! 🗑️',
          error: 'Failed to delete experience'
        }).unwrap().then(() => {
          onUpdate();
        }).catch(() => {
          // Error handled by promiseToast
        });
      },
      'Are you sure you want to delete this experience entry?'
    );
  };

  const openAddModal = () => {
    if (!canAccess) return;
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const openEditModal = (experience: Experience) => {
    if (!canAccess) return;
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
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
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-500">Experience</h2>
                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Locked</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">Complete your professional profile first to unlock this section</p>
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Experience Section Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Please create your professional profile (resume, LinkedIn, GitHub, and skills) first to access the work experience section
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              Professional Profile Required
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                  {canAccess && (
                    <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Available</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your professional work experience and career journey</p>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              disabled={!canAccess}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                canAccess
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((experience, index) => (
                <div 
                  key={experience.id} 
                  className="bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 rounded-2xl border border-cyan-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-cyan-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Header with position and company */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-cyan-500 rounded-xl shadow-md flex-shrink-0">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {experience.position}
                            </h3>
                            {experience.isCurrent && (
                              <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-cyan-700 font-semibold text-lg">
                            {experience.company}
                          </p>
                        </div>
                      </div>

                      {/* Location and dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{experience.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {experience.description && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openEditModal(experience)}
                        disabled={!canAccess}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                          canAccess
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        disabled={!canAccess}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                          canAccess
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Work Experience Added</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {canAccess 
                  ? 'Add your professional work experience to showcase your career journey and achievements'
                  : 'Complete your professional profile first to add work experience details'
                }
              </p>
              <button
                onClick={openAddModal}
                disabled={!canAccess}
                className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                  canAccess
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                {canAccess ? 'Add Your First Experience' : 'Professional Profile Required'}
              </button>
              
              {!canAccess && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Prerequisites</p>
                      <p className="text-sm text-yellow-700">
                        Create your professional profile with resume, LinkedIn, GitHub, and skills to unlock this section.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExperience(null);
        }}
        onSubmit={editingExperience ? handleUpdate : handleAdd}
        data={editingExperience}
        loading={false}
      />
    </>
  );
};

export default ExperienceSection;
