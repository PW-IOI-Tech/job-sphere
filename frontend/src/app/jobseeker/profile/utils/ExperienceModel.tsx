// components/profile/modals/ExperienceModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { Experience, ExperienceFormData } from './types';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExperienceFormData) => void;
  data: Experience | null;
  loading: boolean;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  data, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    location: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        company: data.company || '',
        position: data.position || '',
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        isCurrent: data.isCurrent || false,
        description: data.description || '',
        location: data.location || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        location: ''
      });
    }
  }, [data]);

  // Format dates to ISO datetime before sending
  const formatDateToISO = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base submission data
    const submissionData: ExperienceFormData = {
      company: formData.company,
      position: formData.position,
      startDate: formatDateToISO(formData.startDate),
      isCurrent: formData.isCurrent,
      description: formData.description,
      location: formData.location
    };

    // Include endDate only if:
    // 1. It's not a current position, OR
    // 2. It's a current position but user provided an end date anyway
    if (formData.endDate) {
      submissionData.endDate = formatDateToISO(formData.endDate);
    }
    
    onSubmit(submissionData);
  };

  const handleCurrentChange = (isCurrentPosition: boolean) => {
    setFormData(prev => ({
      ...prev,
      isCurrent: isCurrentPosition,
      // Keep the endDate value - don't clear it automatically
      // User can still provide an end date even for current positions if they want
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {data ? 'Update Experience' : 'Add Experience'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCurrent"
              checked={formData.isCurrent}
              onChange={(e) => handleCurrentChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
              This is my current position
            </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date {formData.isCurrent ? <span className="text-gray-500 text-xs">(Optional for current position)</span> : ''}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!formData.isCurrent}
              />
              {formData.isCurrent && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if this is an ongoing position
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your responsibilities, achievements, etc."
            />
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

export default ExperienceModal;
