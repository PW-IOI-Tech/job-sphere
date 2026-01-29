// api/companyApi.ts
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  ApiResponse,
  Company,
  CompanyCreateData,
  CompanyUpdateData,
  CompanySearchResult,
  CompanySearchResponse,
  MyCompanyResponse,
  SelectCompanyResponse,
  CreateCompanyResponse,
  UpdateCompanyResponse,
  PublicCompany,
  transformSearchResultToCompany
} from './types';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// API configuration
const api = axios.create({
  baseURL: `${backendUrl}/api/employer/companies`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Search companies (public endpoint)
export const searchCompanies = async (query: string): Promise<CompanySearchResult[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response: AxiosResponse<ApiResponse<CompanySearchResponse>> = await api.get(
      `/search?q=${encodeURIComponent(query)}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data.companies;
    }

    return [];
  } catch (error) {
    console.error('Search companies error:', error);
    throw new Error('Failed to search companies');
  }
};

// Get my current company
export const getMyCompany = async (): Promise<{ hasCompany: boolean; company: Company | null }> => {
  try {
    const response: AxiosResponse<ApiResponse<MyCompanyResponse>> = await api.get('/my-company');

    if (response.data.success && response.data.data) {
      return {
        hasCompany: response.data.data.hasCompany,
        company: response.data.data.company
      };
    }

    return { hasCompany: false, company: null };
  } catch (error) {
    console.error('Get my company error:', error);
    throw new Error('Failed to fetch company information');
  }
};

// Select existing company
export const selectExistingCompany = async (companyId: number): Promise<Company> => {
  try {
    const response: AxiosResponse<ApiResponse<SelectCompanyResponse>> = await api.post(
      `/${companyId}/select`
    );

    if (response.data.success && response.data.data) {
      const { employer, company } = response.data.data;

      return {
        id: company.id,
        name: company.name,
        industry: company.industry,
        location: company.location,
        profilePicture: company.profilePicture,
        website: company.website,
        employeeCount: 0, // Will be updated by refetch
        activeJobsCount: 0, // Will be updated by refetch
        myRole: employer.role,
        joinedAt: employer.joinedAt,
        createdAt: employer.createdAt
      };
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Select company error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(error.response.data?.message || 'You are already associated with a company');
      }
    }

    throw new Error('Failed to join company');
  }
};

// Create new company
export const createCompany = async (data: CompanyCreateData): Promise<Company> => {
  try {
    const cleanData = {
      name: data.name.trim(),
      industry: data.industry.trim(),
      description: data.description?.trim() || undefined,
      website: data.website?.trim() || undefined,
      location: data.location?.trim() || undefined,
      profilePicture: data.profilePicture?.trim() || undefined,
      size: data.size || undefined,
      foundedYear: data.foundedYear || undefined
    };

    const response: AxiosResponse<ApiResponse<CreateCompanyResponse>> = await api.post('/', cleanData);

    if (response.data.success && response.data.data) {
      const { company, employer } = response.data.data;

      return {
        ...company,
        myRole: employer.role,
        joinedAt: employer.joinedAt,
        employeeCount: 1,
        activeJobsCount: 0
      };
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Create company error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error(error.response.data?.message || 'Company with this name already exists');
      }

      if (error.response?.status === 400) {
        throw new Error('Please fill in all required fields correctly');
      }
    }

    throw new Error('Failed to create company');
  }
};

// Update company profile
export const updateCompany = async (data: CompanyUpdateData): Promise<Company> => {
  try {
    const cleanData: CompanyUpdateData = {};

    if (data.name) cleanData.name = data.name.trim();
    if (data.industry) cleanData.industry = data.industry.trim();
    if (data.description !== undefined) cleanData.description = data.description?.trim() || undefined;
    if (data.website !== undefined) cleanData.website = data.website?.trim() || undefined;
    if (data.location !== undefined) cleanData.location = data.location?.trim() || undefined;
    if (data.profilePicture !== undefined) cleanData.profilePicture = data.profilePicture?.trim() || undefined;
    if (data.size !== undefined) cleanData.size = data.size;
    if (data.foundedYear !== undefined) cleanData.foundedYear = data.foundedYear;

    const response: AxiosResponse<ApiResponse<UpdateCompanyResponse>> = await api.put('/', cleanData);

    if (response.data.success && response.data.data) {
      const currentCompany = await getMyCompany();

      if (currentCompany.company) {
        return {
          ...currentCompany.company,
          ...response.data.data,
          updatedAt: response.data.data.updatedAt
        };
      }
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Update company error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update this company');
      }

      if (error.response?.status === 409) {
        throw new Error('Company with this name already exists');
      }

      if (error.response?.status === 400) {
        throw new Error('Please fill in all required fields correctly');
      }
    }

    throw new Error('Failed to update company');
  }
};

// Get public company profile
export const getPublicCompany = async (companyId: number): Promise<PublicCompany> => {
  try {
    const response: AxiosResponse<ApiResponse<PublicCompany>> = await api.get(`/public/${companyId}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error('Company not found');
  } catch (error) {
    console.error('Get public company error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Company not found');
      }
    }

    throw new Error('Failed to fetch company information');
  }
};

// Helper function to validate company data
export const validateCompanyData = (data: CompanyCreateData): string[] => {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push('Company name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Company name must be at least 2 characters');
  }

  if (!data.industry.trim()) {
    errors.push('Industry is required');
  }

  if (data.website && data.website.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(data.website.trim())) {
      errors.push('Please enter a valid website URL');
    }
  }

  if (data.profilePicture && data.profilePicture.trim()) {
    const imageUrlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
    if (!imageUrlPattern.test(data.profilePicture.trim())) {
      errors.push('Please enter a valid image URL');
    }
  }

  if (data.foundedYear && (data.foundedYear < 1800 || data.foundedYear > new Date().getFullYear())) {
    errors.push('Please enter a valid founded year');
  }

  return errors;
};

// Export all functions
export const companyApi = {
  searchCompanies,
  getMyCompany,
  selectExistingCompany,
  createCompany,
  updateCompany,
  getPublicCompany,
  validateCompanyData
};

export default companyApi;
