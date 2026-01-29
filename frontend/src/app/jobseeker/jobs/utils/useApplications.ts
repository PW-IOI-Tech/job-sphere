import { useState, useEffect } from 'react';
import { JobSeekerAPI } from './api';
import { Application } from './types';
// import { PaginationParams } from './types'; // Removed because PaginationParams is not exported from types.ts

type PaginationParams = {
  page?: number;
  limit?: number;
};

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async (params: { status?: string } & PaginationParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await JobSeekerAPI.getMyApplications(params);
      if (
        response.success &&
        response.data &&
        Array.isArray((response.data as { applications?: Application[] }).applications)
      ) {
        setApplications((response.data as { applications: Application[] }).applications);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId: string) => {
    try {
      const response = await JobSeekerAPI.withdrawApplication(applicationId);
      if (response.success) {
        // Refresh applications
        fetchApplications();
        return true;
      }
    } catch (err) {
      console.error('Error withdrawing application:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    withdrawApplication,
  };
};
