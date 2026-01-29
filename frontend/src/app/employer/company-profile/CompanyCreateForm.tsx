'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCompany, useCompanyValidation } from '../hooks/useCompany';
import { CompanyCreateData, COMPANY_SIZE_OPTIONS , Company} from './types';

interface Props {
  onCancel: () => void;
  onSuccess: (company: Company) => void;
  isUpdating?: boolean;
  initialData?: CompanyCreateData;
}

export default function CompanyCreateForm({ onCancel, onSuccess, isUpdating = false, initialData }: Props) {
  const [formData, setFormData] = useState<CompanyCreateData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    website: initialData?.website || '',
    industry: initialData?.industry || '',
    location: initialData?.location || '',
    size: initialData?.size || undefined,
    foundedYear: initialData?.foundedYear || undefined,
    profilePicture: initialData?.profilePicture || '',
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  
  const { createCompany } = useCompany();
  const { validateCompanyData } = useCompanyValidation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'foundedYear' ? (value ? Number(value) : undefined) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = validateCompanyData(formData);
    const errorMap: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errorMap.name = 'Company name is required';
    } else if (formData.name.trim().length < 2) {
      errorMap.name = 'Company name must be at least 2 characters';
    }

    if (!formData.industry.trim()) {
      errorMap.industry = 'Industry is required';
    }

    if (formData.website && formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.website.trim())) {
        errorMap.website = 'Please enter a valid website URL';
      }
    }

    if (formData.profilePicture && formData.profilePicture.trim()) {
      const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
      if (!imageUrlPattern.test(formData.profilePicture.trim())) {
        errorMap.profilePicture = 'Please enter a valid image URL (png, jpg, jpeg, gif, svg, webp)';
      }
    }

    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
      errorMap.foundedYear = 'Please enter a valid founded year';
    }

    if (formData.description && formData.description.length > 1000) {
      errorMap.description = 'Description must be less than 1000 characters';
    }

    setErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error('Please fix the errors below');
    return;
  }

  setLoading(true);

  try {
    const cleanData: CompanyCreateData = {
      name: formData.name.trim(),
      industry: formData.industry.trim(),
      description: formData.description?.trim() || undefined,
      website: formData.website?.trim() || undefined,
      location: formData.location?.trim() || undefined,
      profilePicture: formData.profilePicture?.trim() || undefined,
      size: formData.size || undefined,
      foundedYear: formData.foundedYear || undefined,
    };

    const newCompany = await createCompany(cleanData);
    toast.success(`Successfully created ${newCompany.name}!`);
    onSuccess(newCompany);
  } catch (err: unknown) {
    console.error('Create company error:', err);

    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error('Failed to create company');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🏢</span>
            Basic Information
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your company name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 ${
                  errors.industry ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g. Technology, Healthcare, Finance"
                required
              />
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Size
              </label>
              <select
                name="size"
                value={formData.size || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
              >
                <option value="">Select company size</option>
                {COMPANY_SIZE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Founded Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Founded Year
              </label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear || ''}
                onChange={handleChange}
                min={1800}
                max={new Date().getFullYear()}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 ${
                  errors.foundedYear ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="e.g. 2010"
              />
              {errors.foundedYear && (
                <p className="text-red-500 text-sm mt-1">{errors.foundedYear}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span>
            Additional Information
          </h3>
          
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 resize-none ${
                  errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Describe your company, its mission, and what makes it unique..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.description?.length || 0}/1000 characters
                </p>
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 ${
                  errors.website ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 bg-white/60 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all placeholder-gray-400 ${
                  errors.profilePicture ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="https://example.com/logo.png"
              />
              {errors.profilePicture && (
                <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <span className="text-lg">🚀</span>
                Create Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
