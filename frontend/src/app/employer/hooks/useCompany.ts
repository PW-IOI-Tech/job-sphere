// hooks/useCompany.ts
import { useState, useEffect, useCallback } from 'react';
import {
  Company,
  CompanyCreateData,
  CompanyUpdateData,
  CompanySearchResult,
  UseCompanyReturn
} from '../company-profile/types';
import companyApi from '../company-profile/CompanyApi';
import { AxiosError } from 'axios';

export const useCompany = (): UseCompanyReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompany, setHasCompany] = useState<boolean>(false);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await companyApi.getMyCompany();

      setHasCompany(result.hasCompany);
      setCompany(result.company);
    } catch (err: unknown) {
      console.error('Error fetching company:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load company information');
      }
      setHasCompany(false);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchCompany();
  }, [fetchCompany]);

  const createCompany = useCallback(async (data: CompanyCreateData): Promise<Company> => {
    try {
      setError(null);

      const validationErrors = companyApi.validateCompanyData(data);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      const newCompany = await companyApi.createCompany(data);

      setCompany(newCompany);
      setHasCompany(true);

      return newCompany;
    } catch (err: unknown) {
      console.error('Error creating company:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const message = 'Failed to create company';
        setError(message);
        throw new Error(message);
      }
    }
  }, []);

  const selectCompany = useCallback(async (companyId: number): Promise<Company> => {
    try {
      setError(null);

      const selectedCompany = await companyApi.selectExistingCompany(companyId);

      setCompany(selectedCompany);
      setHasCompany(true);

      await fetchCompany();

      return selectedCompany;
    } catch (err: unknown) {
      console.error('Error selecting company:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const message = 'Failed to join company';
        setError(message);
        throw new Error(message);
      }
    }
  }, [fetchCompany]);

  const updateCompany = useCallback(async (data: CompanyUpdateData): Promise<Company> => {
    try {
      setError(null);

      if (!company) {
        throw new Error('No company found to update');
      }

      const updatedCompany = await companyApi.updateCompany(data);

      setCompany(updatedCompany);

      return updatedCompany;
    } catch (err: unknown) {
      console.error('Error updating company:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const message = 'Failed to update company';
        setError(message);
        throw new Error(message);
      }
    }
  }, [company]);

  const searchCompanies = useCallback(async (query: string): Promise<CompanySearchResult[]> => {
    try {
      setError(null);

      if (!query || query.length < 2) {
        return [];
      }

      const results = await companyApi.searchCompanies(query);
      return results;
    } catch (err: unknown) {
      console.error('Error searching companies:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to search companies');
      }
      return [];
    }
  }, []);

  const clearCompany = useCallback(() => {
    setCompany(null);
    setHasCompany(false);
    setError(null);
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return {
    company,
    loading,
    error,
    hasCompany,
    refetch,
    createCompany,
    selectCompany,
    updateCompany,
    searchCompanies,
    clearCompany
  } as UseCompanyReturn & { clearCompany: () => void };
};

export const useCompanySearch = () => {
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchCompanies = useCallback(async (query: string) => {
    try {
      setSearching(true);
      setSearchError(null);

      if (!query || query.length < 2) {
        setSearchResults([]);
        return;
      }

      const results = await companyApi.searchCompanies(query);
      setSearchResults(results);
    } catch (err: unknown) {
      console.error('Error searching companies:', err);
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('Failed to search companies');
      }
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    searching,
    searchError,
    searchCompanies,
    clearSearch
  };
};

export const useCompanyValidation = () => {
  const validateCompanyData = useCallback((data: CompanyCreateData) => {
    return companyApi.validateCompanyData(data);
  }, []);

  const validateCompanyUpdate = useCallback((data: CompanyUpdateData) => {
    const errors: string[] = [];

    if (data.name && data.name.trim().length < 2) {
      errors.push('Company name must be at least 2 characters');
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
  }, []);

  return {
    validateCompanyData,
    validateCompanyUpdate
  };
};

export default useCompany;
