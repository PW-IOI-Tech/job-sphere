'use client';

import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '../hooks/useCompany';
import { CompanySearchResult, transformSearchResultToCompany, Company } from './types';

interface CompanySearchSelectProps {
  onCancel: () => void;
  onSelect: (company: Company) => void;
  onCreateNew: () => void;
}

export default function CompanySearchSelect({ onCancel, onSelect, onCreateNew }: CompanySearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  
  const { searchCompanies, selectCompany } = useCompany();

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        try {
          const results = await searchCompanies(searchTerm);
          setSearchResults(results);
        } catch (error) {
          toast.error('Failed to search companies');
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchCompanies]);

  const handleCompanySelect = async (company: CompanySearchResult) => {
    if (selectedCompanyId === company.id) return;
    
    setSelectedCompanyId(company.id);
    
    // Show changing company toast message
    const changingToast = toast.loading(`Changing to ${company.name}...`, {
      duration: Infinity, // Keep it until we manually dismiss
    });
    
    try {
      const selectedCompany = await selectCompany(company.id);
      
      // Dismiss the loading toast
      toast.dismiss(changingToast);
      
      // Show success toast
      toast.success(`Successfully changed to ${company.name}!`, {
        duration: 4000,
      });
      
      onSelect(selectedCompany);
    } catch (error: unknown) {
  // Dismiss the loading toast
  toast.dismiss(changingToast);

  // Show error toast
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Failed to change company');
  }

  setSelectedCompanyId(null);
}

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedCompanyId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search companies by name, industry, or website..."
          className="w-full pl-12 pr-4 py-4 bg-white/70 border border-gray-200 rounded-xl text-base text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400 shadow-sm"
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
      </div>

      {/* Search Instructions */}
      {searchTerm.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Search for Companies</h3>
          <p className="text-gray-500 mb-6">
            Type at least 2 characters to start searching for companies
          </p>
        </div>
      )}

      {/* Minimum characters message */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="text-center py-8">
          <div className="text-3xl mb-4">⌨️</div>
          <p className="text-gray-500">
            Please enter at least 2 characters to search
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Searching companies...</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && searchTerm.length >= 2 && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} companies
                </p>
              </div>
              
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {searchResults.map((company) => (
                  <div
                    key={company.id}
                    className={`cursor-pointer bg-white/80 backdrop-blur-sm border rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                      selectedCompanyId === company.id 
                        ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/50 opacity-75 pointer-events-none' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        {company.profilePicture ? (
                          <img
                            src={company.profilePicture}
                            alt={`${company.name} logo`}
                            className="w-12 h-12 bg-white rounded-lg object-contain p-2 border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-white">{company.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">{company.name}</h4>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 size={14} className="text-gray-400" />
                            <span>{company.industry}</span>
                          </div>
                          
                          {company.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-gray-400" />
                              <span>{company.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400" />
                            <span>{company._count.employers} employees</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Briefcase size={14} className="text-gray-400" />
                            <span>{company._count.jobs} active jobs</span>
                          </div>
                        </div>

                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {selectedCompanyId === company.id ? (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-indigo-400 transition-colors">
                            <span className="text-gray-400 text-sm">→</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // No Results Found
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Companies Found</h3>
              <p className="text-gray-500 mb-6">
                We couldn&apos;t find any companies matching &quot;{searchTerm}&quot;
              </p>
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Create New Company
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">🚀</span>
          Create New Company
        </button>
        
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-200 transition-all font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
