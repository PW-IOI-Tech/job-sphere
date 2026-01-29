// components/profile/modals/PreferencesModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { Preferences, PreferencesFormData } from './types';
import { JOB_TYPE_OPTIONS, JOB_ROLE_OPTIONS } from './enumMappings';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PreferencesFormData) => void;
  data: Preferences | null;
  loading: boolean;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  data, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    preferredRoles: [] as string[],
    preferredJobTypes: [] as string[],
    preferredLocations: [] as string[],
    salaryExpectationMin: 0,
    salaryExpectationMax: 0,
    remoteWork: false,
    willingToRelocate: false
  });
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        preferredRoles: data.preferredRoles || [],
        preferredJobTypes: data.preferredJobTypes || [],
        preferredLocations: data.preferredLocations || [],
        salaryExpectationMin: data.salaryExpectationMin || 0,
        salaryExpectationMax: data.salaryExpectationMax || 0,
        remoteWork: data.remoteWork || false,
        willingToRelocate: data.willingToRelocate || false
      });
    } else {
      // Reset form for new entries
      setFormData({
        preferredRoles: [],
        preferredJobTypes: [],
        preferredLocations: [],
        salaryExpectationMin: 0,
        salaryExpectationMax: 0,
        remoteWork: false,
        willingToRelocate: false
      });
    }
    setLocationInput(''); // Clear location input when modal opens/closes
  }, [data, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  const toggleJobType = (jobType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(jobType)
        ? prev.preferredJobTypes.filter(j => j !== jobType)
        : [...prev.preferredJobTypes, jobType]
    }));
  };

  // Fixed location handling functions
  const addLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      const trimmedLocation = locationInput.trim();
      
      if (trimmedLocation && !formData.preferredLocations.includes(trimmedLocation)) {
        setFormData(prev => ({ 
          ...prev, 
          preferredLocations: [...prev.preferredLocations, trimmedLocation] 
        }));
        setLocationInput(''); // Clear input after adding
      }
    }
  };

  // Button to add location manually
  const addLocationButton = () => {
    const trimmedLocation = locationInput.trim();
    
    if (trimmedLocation && !formData.preferredLocations.includes(trimmedLocation)) {
      setFormData(prev => ({ 
        ...prev, 
        preferredLocations: [...prev.preferredLocations, trimmedLocation] 
      }));
      setLocationInput(''); // Clear input after adding
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc !== locationToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Update Preferences</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferred Roles Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Roles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
              {JOB_ROLE_OPTIONS.map((role) => (
                <label key={role.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.preferredRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{role.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.preferredRoles.length} role{formData.preferredRoles.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Job Types Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Job Types</label>
            <div className="grid grid-cols-2 gap-2">
              {JOB_TYPE_OPTIONS.map((jobType) => (
                <label key={jobType.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.preferredJobTypes.includes(jobType.value)}
                    onChange={() => toggleJobType(jobType.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{jobType.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Locations Section - FIXED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={addLocation}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type a location and press Enter"
              />
              <button
                type="button"
                onClick={addLocationButton}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add button to add locations</p>
            
            {formData.preferredLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredLocations.map((location, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{location}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation(location)}
                      className="text-blue-600 hover:text-blue-800 ml-1 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">No locations added yet.</p>
              </div>
            )}
          </div>

          {/* Salary Expectations Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Salary Expectations (USD)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                <input
                  type="number"
                  value={formData.salaryExpectationMin}
                  onChange={(e) => setFormData({ ...formData, salaryExpectationMin: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="80000"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                <input
                  type="number"
                  value={formData.salaryExpectationMax}
                  onChange={(e) => setFormData({ ...formData, salaryExpectationMax: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120000"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Work Preferences Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remoteWork"
                checked={formData.remoteWork}
                onChange={(e) => setFormData({ ...formData, remoteWork: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remoteWork" className="text-sm font-medium text-gray-700">
                Open to remote work
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="willingToRelocate"
                checked={formData.willingToRelocate}
                onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="willingToRelocate" className="text-sm font-medium text-gray-700">
                Willing to relocate
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
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

export default PreferencesModal;
