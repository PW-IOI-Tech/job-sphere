'use client';

import React, { useState } from 'react';
import axios,{ AxiosError} from 'axios';
import { EmployerProfile } from './types';
import { toast } from 'sonner';

interface EmployerProfileUpdateFormProps {
  profile: EmployerProfile;
  onCancel: () => void;
  onSuccess: (updated: EmployerProfile) => void;
}

export default function EmployerProfileUpdateForm({
  profile,
  onCancel,
  onSuccess,
}: EmployerProfileUpdateFormProps) {
  const [basicDetails, setBasicDetails] = useState({
    name: profile.user.name,
    phone: profile.user.phone || '',
    location: profile.user.location || '',
    profilePicture: profile.user.profilePicture || '',
  });

  const [employerDetails, setEmployerDetails] = useState({
    jobTitle: profile.jobTitle || '',
    department: profile.department || '',
  });

  const [loadingBasic, setLoadingBasic] = useState(false);
  const [loadingEmployer, setLoadingEmployer] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployerDetails({ ...employerDetails, [e.target.name]: e.target.value });
  };

  const submitBasicDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBasic(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/employer/basic-details`,
        basicDetails ,
        { withCredentials: true }
      );
      if (res.data.success) {
        onSuccess({ ...profile, user: { ...profile.user, ...basicDetails } });
        toast.success("Basic details updated successfully ✅");
      } else {
        toast.error(res.data.message || "Failed to update basic details");
      }
    }catch (err: unknown) {
  if (err instanceof AxiosError) {
    // Handle Axios-specific errors
    toast.error(err.response?.data?.message || "Error updating basic details");
  } else if (err instanceof Error) {
    // Handle general JS errors
    toast.error(err.message);
  } else {
    // Fallback for unknown error shapes
    toast.error("Error updating basic details");
  }
}

 finally {
      setLoadingBasic(false);
    }
  };

  const submitEmployerDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmployer(true);
    try {
      const res = await axios.put(
        `${backendUrl}/api/employer/profile`,
        employerDetails,
        { withCredentials: true }
      );
      if (res.data.success) {
        onSuccess({ ...profile, ...employerDetails });
        toast.success("Employer profile updated successfully ✅");
      } else {
        toast.error(res.data.message || "Failed to update employer profile");
      }
    } catch (err: unknown) {
  if (err instanceof AxiosError) {
    // Handle Axios-specific errors
    toast.error(err.response?.data?.message || "Error updating basic details");
  } else if (err instanceof Error) {
    // Handle general JS errors
    toast.error(err.message);
  } else {
    // Fallback for unknown error shapes
    toast.error("Error updating basic details");
  }
} finally {
      setLoadingEmployer(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Basic Details Form */}
      <form
        onSubmit={submitBasicDetails}
        className="p-6 rounded-3xl border border-indigo-300 bg-white shadow-md space-y-6"
      >
        <h3 className="text-2xl font-bold text-indigo-700 mb-4">Update Basic Details</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={basicDetails.name}
              onChange={handleBasicChange}
              placeholder="Name"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={basicDetails.phone}
              onChange={handleBasicChange}
              placeholder="Phone"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={basicDetails.location}
              onChange={handleBasicChange}
              placeholder="Location"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="profilePicture">
              Profile Picture URL
            </label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="url"
              value={basicDetails.profilePicture}
              onChange={handleBasicChange}
              placeholder="Profile Picture URL"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {basicDetails.profilePicture && (
              <img
                src={basicDetails.profilePicture}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-xl border border-indigo-200 shadow"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingBasic}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:from-indigo-500 hover:to-blue-500 transition disabled:opacity-50"
        >
          {loadingBasic ? 'Saving...' : 'Save Basic Details'}
        </button>
      </form>

      {/* Employer Profile Form */}
      <form
        onSubmit={submitEmployerDetails}
        className="p-6 rounded-3xl border border-indigo-300 bg-white shadow-md space-y-6"
      >
        <h3 className="text-2xl font-bold text-indigo-700 mb-4">Update Employer Profile</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              required
              value={employerDetails.jobTitle}
              onChange={handleEmployerChange}
              placeholder="Job Title"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Department */}
          <div className="flex flex-col">
            <label className="text-sm text-indigo-600 mb-1" htmlFor="department">
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={employerDetails.department}
              onChange={handleEmployerChange}
              placeholder="Department"
              className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingEmployer}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:from-indigo-500 hover:to-blue-500 transition disabled:opacity-50"
        >
          {loadingEmployer ? 'Saving...' : 'Save Employer Profile'}
        </button>
      </form>

      <button
        type="button"
        onClick={onCancel}
        className="mt-6 px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  );
}
