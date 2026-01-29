import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { JobSeekerAPI } from './api';
import { Job } from './types';

import type { JobFilters } from './types';

interface UseJobsOptions {
  initialFilters?: JobFilters;
  autoFetch?: boolean;
}

export const useJobs = ({ initialFilters = {}, autoFetch = true }: UseJobsOptions = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNext: false,
  });
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {});

  const fetchJobs = useCallback(async (newFilters: JobFilters = filters, showToast = false, isInitial = false) => {
    setError(null);
    
    let toastId: string | number | undefined;
    
    // Show toast for initial load or when explicitly requested
    if (showToast || isInitial) {
      const message = isInitial ? 'Loading jobs...' : 'Searching jobs...';
      toastId = toast.loading(message);
    }

    try {
      type JobsApiResponse = {
        success: boolean;
        message?: string;
        data?: {
          jobs: Job[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            hasNext: boolean;
          };
        };
      };

      const response = await JobSeekerAPI.getJobs(newFilters) as JobsApiResponse;
      
      if (toastId) {
        toast.dismiss(toastId);
      }

      if (response.success && response.data) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
        
        if (isInitial) {
          setIsInitialLoad(false);
          toast.success(`Found ${response.data.jobs.length} job${response.data.jobs.length !== 1 ? 's' : ''}`);
        } else if (showToast) {
          toast.success(`Found ${response.data.jobs.length} job${response.data.jobs.length !== 1 ? 's' : ''}`);
        }
      } else {
        setError(response.message || 'Failed to fetch jobs');
        setJobs([]);
        if (toastId) {
          toast.error(response.message || 'Failed to fetch jobs');
        }
      }
    } catch (err) {
      if (toastId) {
        toast.dismiss(toastId);
        toast.error('Network error. Please check your connection.');
      }
      console.error('Error fetching jobs:', err);
      setError('Network error. Please check your connection.');
      setJobs([]);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters, true);
  }, [filters, fetchJobs]);

  const changePage = useCallback((page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters, true); // Show toast for page changes
  }, [filters, fetchJobs]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    fetchJobs(initialFilters, true);
    toast.success('Filters reset');
  }, [initialFilters, fetchJobs]);

  const refetch = useCallback(() => {
    fetchJobs(filters, true);
  }, [fetchJobs, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchJobs(filters, false, isInitialLoad); // Show toast for initial load
    }
  }, [autoFetch]); // Remove fetchJobs from dependency to prevent infinite loop

  return {
    jobs,
    error,
    pagination,
    filters,
    fetchJobs,
    updateFilters,
    changePage,
    resetFilters,
    refetch,
    isInitialLoad,
  };
};
