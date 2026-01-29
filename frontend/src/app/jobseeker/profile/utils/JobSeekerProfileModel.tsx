// components/profile/modals/JobSeekerProfileModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { showErrorToast } from './toasts';
import { JobSeekerProfileFormData } from './types';

interface JobSeekerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobSeekerProfileFormData) => void;
  data: JobSeekerProfileFormData | null;
  loading: boolean;
  isCreating: boolean;
}

const JobSeekerProfileModal: React.FC<JobSeekerProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  data, 
  loading,
  isCreating 
}) => {
  const [formData, setFormData] = useState({
    resume: '',
    linkedin: '',
    github: '',
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (data && !isCreating) {
      // Updating existing profile
      setFormData({
        resume: data.resume || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        skills: data.skills || []
      });
    } else {
      // Creating new profile - start fresh
      setFormData({
        resume: '',
        linkedin: '',
        github: '',
        skills: []
      });
    }
    setValidationErrors({});
    setSkillInput('');
  }, [data, isCreating, isOpen]);

  // URL validation functions
  const validateResumeUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    // Accept various resume hosting services
    const patterns = [
      /^https:\/\/drive\.google\.com\//, // Google Drive
      /^https:\/\/www\.dropbox\.com\//, // Dropbox
      /^https:\/\/[^\/]+\.s3\./, // AWS S3
      /^https?:\/\/[^\/]+\.(pdf|doc|docx)$/i, // Direct file links
      /^https?:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}\/.*\.(pdf|doc|docx)$/i // Other domains with file extensions
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-]+\/?$/;
    return pattern.test(url);
  };

  const validateGitHubUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    const pattern = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9\-]+\/?$/;
    return pattern.test(url);
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Skills validation - required
    if (!formData.skills || formData.skills.length === 0) {
      errors.skills = 'Please add at least one skill';
    }

    // URL validations
    if (formData.resume && !validateResumeUrl(formData.resume)) {
      errors.resume = 'Please enter a valid resume URL (Google Drive, Dropbox, or direct file link)';
    }

    if (formData.linkedin && !validateLinkedInUrl(formData.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)';
    }

    if (formData.github && !validateGitHubUrl(formData.github)) {
      errors.github = 'Please enter a valid GitHub profile URL (e.g., https://github.com/username)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.values(validationErrors)[0];
      showErrorToast('Validation Error', firstError);
      return;
    }

    // Prepare data - only include URLs if they have values
    const submissionData = {
      skills: formData.skills,
      ...(formData.resume && { resume: formData.resume }),
      ...(formData.linkedin && { linkedin: formData.linkedin }),
      ...(formData.github && { github: formData.github })
    };
    
    onSubmit(submissionData);
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const trimmedSkill = skillInput.trim();
      
      if (!formData.skills.includes(trimmedSkill)) {
        setFormData({ 
          ...formData, 
          skills: [...formData.skills, trimmedSkill] 
        });
        setValidationErrors(prev => ({ ...prev, skills: '' })); // Clear skills error
      }
      setSkillInput('');
    }
  };

  const addSkillButton = () => {
    const trimmedSkill = skillInput.trim();
    
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, trimmedSkill] 
      });
      setValidationErrors(prev => ({ ...prev, skills: '' })); // Clear skills error
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Clear validation error when user starts typing
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {isCreating ? 'Create Professional Profile' : 'Update Professional Profile'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume URL (Optional)
            </label>
            <input
              type="url"
              value={formData.resume}
              onChange={(e) => handleInputChange('resume', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.resume ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://drive.google.com/file/d/... or https://dropbox.com/..."
            />
            {validationErrors.resume && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.resume}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported: Google Drive, Dropbox, or direct PDF/DOC links
            </p>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL (Optional)
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.linkedin ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://linkedin.com/in/your-profile"
            />
            {validationErrors.linkedin && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.linkedin}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL (Optional)
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.github ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://github.com/your-username"
            />
            {validationErrors.github && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.github}</p>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                className={`flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.skills && formData.skills.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkillButton}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add button to add skills</p>
            
            {/* Skills Display */}
            {formData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800 ml-1 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className={`mt-2 p-2 border rounded-md ${
                validationErrors.skills ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <p className={`text-sm ${
                  validationErrors.skills ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {validationErrors.skills || 'No skills added yet. Please add at least one skill.'}
                </p>
              </div>
            )}
          </div>

          {/* Information Box for New Profiles */}
          {isCreating && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Creating Your Profile</p>
                  <p className="text-sm text-blue-700">
                    Once you create your professional profile, you&apos;ll unlock access to add your education, experience, projects, and job preferences.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading 
                ? (isCreating ? 'Creating...' : 'Saving...') 
                : (isCreating ? 'Create Profile' : 'Save Changes')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSeekerProfileModal;
