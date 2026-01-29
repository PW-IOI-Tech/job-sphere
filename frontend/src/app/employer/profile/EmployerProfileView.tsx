'use client';

import { useState, useEffect } from 'react';
import EmployerProfileUpdateForm from './EmployerProfileUpdateForm';
import { EmployerProfile } from './types';

interface Props {
  profile: EmployerProfile | null;
}

export default function EmployerProfileView({ profile }: Props) {
  const [currentProfile, setCurrentProfile] = useState<EmployerProfile | null>(profile);
  const [editing, setEditing] = useState(false);

  // Keep local state in sync with parent-prop changes
  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  if (!currentProfile) {
    return (
      <div className="text-center py-14 text-red-600 font-semibold text-lg">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="min-w-full min-h-screen space-y-8 px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-700 rounded-xl py-8 shadow-lg select-none">
        Employer Profile
      </h2>

      {editing ? (
        <EmployerProfileUpdateForm
          profile={currentProfile}
          onCancel={() => setEditing(false)}
          onSuccess={(updated) => {
            setCurrentProfile(updated);
            setEditing(false);
          }}
        />
      ) : (
        <>
          {/* Grid: Basic Info + Employer Info */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Basic Info */}
            <section className="p-6 rounded-3xl border border-blue-300 bg-white shadow-md text-gray-800">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-indigo-700 select-none">
                <span className="text-4xl">
                  {currentProfile.user.profilePicture ? (
                    <img
                      src={currentProfile.user.profilePicture}
                      alt={`${currentProfile.user.name}'s profile`}
                      className="rounded-full border border-blue-200 shadow-sm max-w-[110px] h-[110px] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-[110px] h-[110px] rounded-full bg-indigo-200 text-indigo-800 font-extrabold flex items-center justify-center text-5xl">
                      {currentProfile.user.name.charAt(0)}
                    </div>
                  )}
                </span>
                Basic Info
              </h3>
              <div className="space-y-4 leading-relaxed text-base">
                <p>
                  <strong className="text-gray-900">Name:</strong> {currentProfile.user.name}
                </p>
                <p>
                  <strong className="text-gray-900">Email:</strong> {currentProfile.user.email}
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong> {currentProfile.user.phone || 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Location:</strong> {currentProfile.user.location || 'N/A'}
                </p>
              </div>
            </section>

            {/* Employer Profile */}
            <section className="p-6 rounded-3xl border border-indigo-300 bg-white shadow-md text-gray-800">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-indigo-700 select-none">
                <span className="text-4xl">💼</span> Employer Profile
              </h3>
              <div className="space-y-4 leading-relaxed text-base">
                <p>
                  <strong className="text-gray-900">Job Title:</strong> {currentProfile.jobTitle || 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Department:</strong> {currentProfile.department || 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Role:</strong> {currentProfile.role || 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Total Jobs Posted:</strong> {currentProfile.totalJobsPosted || 0}
                </p>
              </div>
            </section>
          </div>
          {/* Update Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-3 text-white font-semibold text-lg shadow-lg hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 select-none transition-transform active:scale-95"
              aria-label="Update Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Update Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
