'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCompany } from '../hooks/useCompany';
import { Company } from './types';
import CompanyProfileView from './CompanyProfileView';
import CompanySearchSelect from './CompanySearchSelect';
import CompanyCreateForm from './CompanyCreateForm';

export default function CompanyDashboard() {
  const { company, loading, error, hasCompany, refetch } = useCompany();
  const [currentView, setCurrentView] = useState<'profile' | 'search' | 'create'>('profile');

  // Handle company selection from search
  const handleCompanySelect = async (selectedCompany: Company) => {
    
    try {
      await refetch(); // Refresh to get updated data
      setCurrentView('profile');
      toast.success(`Successfully joined ${selectedCompany.name}!`);
    } catch (error) {
      toast.error('Failed to join company. Please try again.');
    }
  };

  // Handle company creation
  const handleCompanyCreate = async (newCompany: Company) => {
    try {
      await refetch(); // Refresh to get updated data
      setCurrentView('profile');
      toast.success(`Successfully created ${newCompany.name}!`);
    } catch (error) {
      toast.error('Failed to create company. Please try again.');
    }
  };

  // Handle editing company
  const handleEdit = () => {
    // This will be handled within CompanyProfileView
  };

  // Handle changing company (search for new one)
  const handleChangeCompany = () => {
    setCurrentView('search');
  };

  // Handle creating new company
  const handleCreateNew = () => {
    setCurrentView('create');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-gray-700 font-semibold">Loading company information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 border border-red-200 shadow-2xl max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Company</h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
      {hasCompany && company && currentView === 'profile' ? (
        // Show company profile when user has a company
        <CompanyProfileView
          company={company}
          onEdit={handleEdit}
          onChangeCompany={handleChangeCompany}
          onCreateNew={handleCreateNew}
        />
      ) : (
        // Show welcome screen when no company or switching
        <div className="p-8 w-full">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-12 py-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 opacity-20 rounded-full transform -translate-x-16 translate-y-16"></div>

                <div className="relative z-10 text-center">
                  <div className="text-7xl mb-6">🏢</div>
                  <h1 className="text-5xl font-bold mb-4">Company Dashboard</h1>
                  <p className="text-2xl text-blue-100">
                    {hasCompany && company 
                      ? 'Manage your company profile' 
                      : 'Get started by joining or creating a company profile'
                    }
                  </p>
                </div>
              </div>

              <div className="px-12 py-12 bg-white/60 backdrop-blur-sm">
                <div className="text-center mb-12">
                  <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                    {hasCompany && company
                      ? 'Choose an option below to manage your company.'
                      : 'You haven\'t joined a company yet. Choose one of the options below to get started.'
                    }
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Search/Join Company Card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-white">🔍</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {hasCompany ? 'Change Company' : 'Join Existing Company'}
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        {hasCompany 
                          ? 'Search for and switch to a different company that\'s already registered.'
                          : 'Search for and join an existing company that\'s already registered on our platform.'
                        }
                      </p>
                      <button
                        className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-lg transition-all duration-200 shadow-lg"
                        onClick={() => setCurrentView('search')}
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl">🔎</span>
                          {hasCompany ? 'Search Companies' : 'Search Companies'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Create Company Card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-white">✨</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Create New Company</h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Start from scratch and create a brand new company profile with all your business details.
                      </p>
                      <button
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg transition-all duration-200 shadow-lg"
                        onClick={() => setCurrentView('create')}
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl">🚀</span>
                          Create Company Profile
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                  <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 max-w-3xl mx-auto">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">💡 Need Help?</h4>
                    <p className="text-gray-700">
                      {hasCompany 
                        ? 'You can switch between companies or create a new one. Your profile will be updated accordingly.'
                        : 'Creating a company profile allows you to post jobs, manage applications, and build your employer brand. If you\'re joining an existing company, make sure you have the correct company name or details.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {currentView === 'search' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white relative">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Search Companies</h2>
                  <p className="text-indigo-100 mt-2">Find and join an existing company</p>
                </div>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="text-white hover:text-gray-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <CompanySearchSelect
                onCancel={() => setCurrentView('profile')}
                onSelect={handleCompanySelect}
                onCreateNew={() => setCurrentView('create')}
              />
            </div>
          </div>
        </div>
      )}

      {currentView === 'create' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white relative">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Create New Company</h2>
                  <p className="text-blue-100 mt-2">Fill out the details to create your company profile</p>
                </div>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="text-white hover:text-gray-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <CompanyCreateForm
                onCancel={() => setCurrentView('profile')}
                onSuccess={handleCompanyCreate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
