'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Building2, AlertCircle, RefreshCw, Briefcase, Users, ExternalLink, Eye } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';

// Updated type definitions to match new API response
interface JobListing {
  title: string;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  website?: string | null;
  profilePicture?: string | null;
  description?: string;
  jobs: JobListing[];
  activeJobCount: number;
  activeJobTitles: string[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Company[];
}

const CompaniesExplorer: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        await toast.promise(
          axios.get<ApiResponse>(`${backendUrl}/api/jobseeker/companies`, {
            withCredentials: true,
          }),
          {
            loading: 'Loading companies...',
            success: (response) => {
              const result = response.data;
              if (result.success && result.data) {
                setCompanies(result.data);
                setFilteredCompanies(result.data);
                return `Successfully loaded ${result.data.length} companies! 🏢`;
              } else {
                throw new Error(result.message || 'Failed to load companies');
              }
            },
            error: (err) => {
              let errorMessage = 'Failed to fetch companies';
              if (axios.isAxiosError(err)) {
                if (err.code === 'ECONNABORTED') {
                  errorMessage = 'Request timed out. Please try again.';
                } else if (err.response) {
                  errorMessage = `Server error: ${err.response.status}`;
                } else if (err.request) {
                  errorMessage = 'Network error. Please check your connection.';
                }
              } else if (err instanceof Error) {
                errorMessage = err.message;
              }
              
              setError(errorMessage);
              return errorMessage;
            }
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [backendUrl]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company: Company) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          company.name?.toLowerCase().includes(searchLower) ||
          company.industry?.toLowerCase().includes(searchLower) ||
          company.location?.toLowerCase().includes(searchLower) ||
          company.description?.toLowerCase().includes(searchLower) ||
          company.activeJobTitles?.some(title => title.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const getInitials = (name: string): string => {
    if (!name) return 'CO';
    return name.split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getGradientClass = (name: string): string => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-yellow-500 to-orange-500',
      'from-teal-500 to-teal-600'
    ];
    
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Get unique job titles for display
  const getUniqueJobTitles = (titles: string[]) => {
    const unique = [...new Set(titles)];
    return unique.slice(0, 3); // Show max 3 unique titles
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Companies</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Company Explorer
                  </h1>
                  <p className="text-gray-600 text-lg">Discover amazing companies and career opportunities</p>
                </div>
              </div>
              
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search companies, industries, locations, or job titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 shadow-lg"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No companies available at the moment'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 inline-block">
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-blue-600 font-bold">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
                  {searchTerm && (
                    <span className="text-gray-500 ml-2">
                      for &quot;{searchTerm}&quot;
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Company Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {company.profilePicture ? (
                          <Image
                            src={company.profilePicture}
                            alt={company.name}
                            className="w-16 h-16 rounded-xl object-cover ring-4 ring-blue-100 shadow-lg"
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradientClass(company.name)} flex items-center justify-center ring-4 ring-white shadow-lg`}>
                            <span className="text-white font-bold text-xl">
                              {getInitials(company.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                          {company.name}
                        </h3>
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {company.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="p-6 flex-grow">
                    {/* Location and Website */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{company.location}</span>
                      </div>
                      
                      {company.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm flex items-center"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Job Statistics */}
                    {company.activeJobCount > 0 && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Briefcase className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 font-semibold text-sm">
                            {company.activeJobCount} Active {company.activeJobCount === 1 ? 'Job' : 'Jobs'}
                          </span>
                        </div>
                        
                        {company.activeJobTitles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {getUniqueJobTitles(company.activeJobTitles).map((title, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center bg-white/80 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200"
                              >
                                {title}
                              </span>
                            ))}
                            {company.activeJobTitles.length > 3 && (
                              <span className="inline-flex items-center bg-white/80 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                                +{company.activeJobTitles.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {company.description && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {company.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <button 
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                        company.activeJobCount > 0
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                      }`}
                      disabled={loading}
                    >
                      <Eye className="w-4 h-4" />
                      <span>
                        {company.activeJobCount > 0 
                          ? `View ${company.activeJobCount} ${company.activeJobCount === 1 ? 'Job' : 'Jobs'}`
                          : 'View Company'
                        }
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesExplorer;
