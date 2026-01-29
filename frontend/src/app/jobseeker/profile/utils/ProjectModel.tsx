// components/profile/modals/ProjectModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { Project, ProjectFormData } from './types';
import { showErrorToast } from './toasts';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  data: Project | null;
  loading: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  data, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    startDate: '',
    endDate: '',
    githubUrl: '',
    liveUrl: '',
    isActive: false
  });
  const [techInput, setTechInput] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        technologies: data.technologies || [],
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        githubUrl: data.githubUrl || '',
        liveUrl: data.liveUrl || '',
        isActive: data.isActive || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        githubUrl: '',
        liveUrl: '',
        isActive: false
      });
    }
    setValidationError('');
  }, [data, isOpen]);

  // URL validation functions
  const validateGithubUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    const pattern = /^https:\/\/github\.com\/[A-Za-z0-9_\-]+\/[A-Za-z0-9_\-]+(\.git)?$|^https:\/\/github\.com\/[A-Za-z0-9_\-]+\/[A-Za-z0-9_\-]+$/;
    return pattern.test(url);
  };

  const validateLiveUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/i;
    return pattern.test(url);
  };

  // Format dates to ISO datetime before sending
  const formatDateToISO = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate technologies
    if (!formData.technologies || formData.technologies.length === 0) {
      showErrorToast('Validation Error', 'Please add at least one technology');
    return;
    }

    // Validate dates
    if (!formData.startDate || !formData.endDate) {
      showErrorToast('Validation Error', 'Please fill in both start and end dates');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showErrorToast('Validation Error', 'Start date cannot be after end date');
    return;
    }

    // Validate URLs
    if (formData.githubUrl && !validateGithubUrl(formData.githubUrl)) {
      showErrorToast('Invalid URL', 'Please enter a valid GitHub URL (e.g., https://github.com/user/repo)');
    return;
    }

    if (formData.liveUrl && !validateLiveUrl(formData.liveUrl)) {
      showErrorToast('Invalid URL', 'Please enter a valid live URL (e.g., https://example.com)');
    return;
    }

    // Prepare data for submission - only include URLs if they have values
    const formattedData = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies,
      startDate: formatDateToISO(formData.startDate),
      endDate: formatDateToISO(formData.endDate),
      isActive: formData.isActive,
      // Only include URL fields if they have values
      ...(formData.githubUrl && { githubUrl: formData.githubUrl }),
      ...(formData.liveUrl && { liveUrl: formData.liveUrl })
    };
    
    onSubmit(formattedData);
  };

  const addTechnology = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const trimmedTech = techInput.trim();
      
      if (!formData.technologies.includes(trimmedTech)) {
        setFormData({ 
          ...formData, 
          technologies: [...formData.technologies, trimmedTech] 
        });
        setValidationError(''); // Clear validation error when technology is added
      }
      setTechInput('');
    }
  };

  const addTechnologyButton = () => {
    const trimmedTech = techInput.trim();
    
    if (trimmedTech && !formData.technologies.includes(trimmedTech)) {
      setFormData({ 
        ...formData, 
        technologies: [...formData.technologies, trimmedTech] 
      });
      setValidationError(''); // Clear validation error when technology is added
      setTechInput('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(tech => tech !== techToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {data ? 'Update Project' : 'Add Project'}
        </h3>
        
        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {validationError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTechnology}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type a technology and press Enter"
              />
              <button
                type="button"
                onClick={addTechnologyButton}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add button to add technologies</p>
            
            {formData.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-blue-600 hover:text-blue-800 ml-1 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">No technologies added yet. Please add at least one.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL (Optional)</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formData.githubUrl && !validateGithubUrl(formData.githubUrl) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="https://github.com/username/repo"
            />
            {formData.githubUrl && !validateGithubUrl(formData.githubUrl) && (
              <p className="text-xs text-red-600 mt-1">Please enter a valid GitHub URL</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL (Optional)</label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formData.liveUrl && !validateLiveUrl(formData.liveUrl) 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="https://yourproject.com"
            />
            {formData.liveUrl && !validateLiveUrl(formData.liveUrl) && (
              <p className="text-xs text-red-600 mt-1">Please enter a valid URL starting with http:// or https://</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              This is an active/ongoing project
            </label>
          </div>

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
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
