'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCompany } from '../hooks/useCompany';
import { Company, CompanyUpdateData, formatCompanySize } from './types';
import CompanyEditForm from './CompanyEditForm';

interface Props {
  company: Company;
  onEdit: () => void;
  onChangeCompany: () => void;
  onCreateNew: () => void;
}

export default function CompanyProfileView({ company, onEdit, onChangeCompany, onCreateNew }: Props) {
  const [editing, setEditing] = useState(false);
  const { updateCompany } = useCompany();

  const handleDelete = () => {
    // Show toast message instead of allowing deletion
    toast.error('Please contact administrator to delete the Company', {
      duration: 4000,
      position: 'top-right',
    });
  };

  const handleEditSave = async (updatedCompany: Company) => {
    setEditing(false);
    toast.success('Company profile updated successfully!');
  };

  const handleEditCancel = () => {
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 w-full">
      <div className="w-full mx-auto">
        {!editing ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 px-6 py-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0">
                  {company.profilePicture ? (
                    <img
                      src={company.profilePicture}
                      alt={`${company.name} logo`}
                      className="w-16 h-16 bg-white rounded-lg object-contain p-2 shadow-md border-2 border-indigo-300"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-indigo-200 rounded-lg flex items-center justify-center border-2 border-indigo-400 shadow-md">
                      <span className="text-xl font-bold text-indigo-700">{company.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                      🏢 {company.industry}
                    </span>
                    {company.location && (
                      <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                        📍 {company.location}
                      </span>
                    )}
                    {company.foundedYear && (
                      <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                        🗓️ Founded {company.foundedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-6 bg-white/70 backdrop-blur-sm border-b border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xl font-bold text-indigo-700 mb-1">{company.employeeCount}</div>
                  <div className="text-gray-500 text-xs">Employees</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xl font-bold text-indigo-700 mb-1">{company.activeJobsCount}</div>
                  <div className="text-gray-500 text-xs">Active Jobs</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-base font-bold text-indigo-600 mb-1">{company.myRole}</div>
                  <div className="text-gray-500 text-xs">Your Role</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-base font-bold text-indigo-600 mb-1">
                    {new Date(company.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-gray-500 text-xs">Joined</div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8 bg-white/70 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/60 rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-base">📖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">About Company</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {company.description || "No description provided."}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                      <span className="text-base">🏬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Company Details</h3>
                  </div>
                  <div className="space-y-3">
                    {company.website && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-md border border-gray-200">
                        <div className="w-8 h-8 bg-indigo-200 rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🌐</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Website</div>
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline text-sm"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-md border border-gray-200">
                      <div className="w-8 h-8 bg-blue-200 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">👥</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Company Size</div>
                        <div className="font-semibold text-gray-700 text-sm">
                          {formatCompanySize(company.size)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={onChangeCompany}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
                  >
                    🔄 Change Company
                  </button>
                  <button
                    onClick={onCreateNew}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
                  >
                    ✨ Create New
                  </button>
                </div>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CompanyEditForm
            company={company}
            onCancel={handleEditCancel}
            onSuccess={handleEditSave}
          />
        )}
      </div>
    </div>
  );
}
