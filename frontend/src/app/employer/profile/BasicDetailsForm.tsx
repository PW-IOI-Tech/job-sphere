'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { BasicDetailsUpdate } from './types';

interface Props {
  onComplete: () => void;
  defaultName?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function BasicDetailsForm({ onComplete, defaultName = '' }: Props) {
  const [formData, setFormData] = useState<BasicDetailsUpdate>({
    name: defaultName,
    phone: '',
    location: '',
    profilePicture: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

   try {
  const res = await axios.put<ApiResponse>(
    `${backendUrl}/api/employer/basic-details`,
    formData,
    { withCredentials: true }
  );

  if (res.data.success) {
    onComplete();
  } else {
    setError(res.data.message || 'Failed to update basic details');
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
      className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-green-700">
        Step 1: Basic Details
      </h2>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          minLength={10}
          maxLength={15}
          pattern="[0-9]{10,15}"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Profile Picture URL (optional)
        </label>
        <input
          type="url"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </form>
  );
}
