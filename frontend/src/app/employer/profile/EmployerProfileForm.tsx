'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { EmployerProfileFormData } from './types';

interface Props {
  onComplete: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const roleOptions: Array<{ label: string; value: EmployerProfileFormData['role'] }> = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'HR Manager', value: 'HR_MANAGER' },
  { label: 'Hiring Manager', value: 'HIRING_MANAGER' },
  { label: 'Recruiter', value: 'RECRUITER' },
];

export default function EmployerProfileForm({ onComplete }: Props) {
  const [formData, setFormData] = useState<EmployerProfileFormData>({
    jobTitle: '',
    department: '',
    role: 'RECRUITER',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);



try {
  const res = await axios.post<ApiResponse>(
    `${backendUrl}/api/employer/profile`,
    formData,
    { withCredentials: true }
  );

  if (res.data.success) {
    onComplete();
  } else {
    setError(res.data.message || 'Failed to update employer profile');
  }
} catch (err) {
  const error = err as AxiosError<{ message: string }>; // type casting
  setError(error.response?.data?.message || error.message || 'An error occurred');
} finally {
  setLoading(false);
}

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-5 bg-white shadow-md rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">Step 2: Employer Profile Details</h2>

      {/* Job Title */}
      <div>
        <label htmlFor="jobTitle" className="block mb-1 font-medium text-gray-700">
          Job Title
        </label>
        <input
          id="jobTitle"
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      {/* Department */}
      <div>
        <label htmlFor="department" className="block mb-1 font-medium text-gray-700">
          Department
        </label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block mb-1 font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {roleOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg text-white font-semibold shadow-md transition ${
          loading
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
        }`}
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </form>
  );
}
