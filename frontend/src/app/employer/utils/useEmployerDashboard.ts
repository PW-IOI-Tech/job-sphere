'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmployerData, EmployerApiResponse } from './types';
import { employerDashboardApi } from './employerDashboardApi';

interface UseEmployerDashboardReturn {
  data: EmployerData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useEmployerDashboard = (autoRefreshInterval?: number): UseEmployerDashboardReturn => {
  const [data, setData] = useState<EmployerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employerDashboardApi.getDashboardData(force);
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.message || 'Failed to fetch employer dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      await employerDashboardApi.refreshDashboard();
      await fetchData(true);
    } catch (err) {
      console.error('Employer refetch failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
    }
  }, [fetchData]);

  // Initial data load with cache check
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const cached = employerDashboardApi.getCachedData();
        if (cached && cached.success) {
          setData(cached.data);
          setLastUpdated(new Date());
          setLoading(false);

          // Check if cached data is stale and fetch fresh data if needed
          if (employerDashboardApi.isDataStale()) {
            await fetchData(false);
          }
        } else {
          await fetchData(false);
        }
      } catch (err) {
        console.error('Initial data load failed:', err);
        await fetchData(false);
      }
    };

    loadInitialData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      // Only refresh if document is visible and we have existing data
      if (!document.hidden && data && !loading) {
        fetchData(false);
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchData, data, loading]);

  // Handle page visibility changes for better performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && data && employerDashboardApi.isDataStale()) {
        fetchData(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [data, fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    lastUpdated 
  };
};
