'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCompany, useCompanyValidation } from '../hooks/useCompany';
import { Company, CompanyUpdateData, COMPANY_SIZE_OPTIONS } from './types';

interface Props {
  company: Company;
  onCancel: () => void;
  onSuccess: (updatedCompany: Company) => void;
}

export default function CompanyEditForm({ company, onCancel, onSuccess }: Props) {
  const [formData, setFormData] = useState<CompanyUpdateData>({
    name: company.name,
    description: company.description || '',
    website: company.website || '',
    industry: company.industry,
    location: company.location || '',
    size: company.size || undefined,
    foundedYear: company.foundedYear || undefined,
    profilePicture: company.profilePicture || '',
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  
  const { updateCompany } = useCompany();
  const { validateCompanyUpdate } = useCompanyValidation();

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
    const errorMap: {[key: string]: string} = {};

    if (!formData.name || !formData.name.trim()) {
      errorMap.name = 'Company name is required';
    } else if (formData.name.trim().length < 2) {
      errorMap.name = 'Company name must be at least 2 characters';
    }

    if (!formData.industry || !formData.industry.trim()) {
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
      const cleanData: CompanyUpdateData = {};
      
      // Only include fields that have changed
      if (formData.name && formData.name.trim() !== company.name) {
        cleanData.name = formData.name.trim();
      }
      if (formData.industry && formData.industry.trim() !== company.industry) {
        cleanData.industry = formData.industry.trim();
      }
      if (formData.description !== company.description) {
        cleanData.description = formData.description?.trim() || undefined;
      }
      if (formData.website !== company.website) {
        cleanData.website = formData.website?.trim() || undefined;
      }
      if (formData.location !== company.location) {
        cleanData.location = formData.location?.trim() || undefined;
      }
      if (formData.profilePicture !== company.profilePicture) {
        cleanData.profilePicture = formData.profilePicture?.trim() || undefined;
      }
      if (formData.size !== company.size) {
        cleanData.size = formData.size;
      }
      if (formData.foundedYear !== company.foundedYear) {
        cleanData.foundedYear = formData.foundedYear;
      }

      // Check if any changes were made
      if (Object.keys(cleanData).length === 0) {
        toast.info('No changes detected');
        onCancel();
        return;
      }

      const updatedCompany = await updateCompany(cleanData);
      toast.success('Company profile updated successfully!');
      onSuccess(updatedCompany);
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

  const handleReset = () => {
    setFormData({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      industry: company.industry,
      location: company.location || '',
      size: company.size || undefined,
      foundedYear: company.foundedYear || undefined,
      profilePicture: company.profilePicture || '',
    });
    setErrors({});
    toast.info('Form reset to original values');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full transform -translate-x-8 translate-y-8"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              Edit Company Profile
            </h2>
            <p className="text-blue-100">Update your company information</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
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
                value={formData.name || ''}
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
                value={formData.industry || ''}
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
                value={formData.location || ''}
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
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
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
                value={formData.description || ''}
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
                  {(formData.description?.length || 0)}/1000 characters
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
                value={formData.website || ''}
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
                value={formData.profilePicture || ''}
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
        <div className="flex flex-wrap justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-300 hover:bg-yellow-200 transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <span className="text-lg">🔄</span>
            Reset Form
          </button>
          
          <div className="flex gap-4">
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
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="text-lg">💾</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
