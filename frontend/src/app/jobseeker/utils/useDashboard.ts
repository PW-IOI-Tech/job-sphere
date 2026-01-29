// hooks/useDashboard.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from './types';
import { dashboardApi } from './dashboardApi';

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
  cacheInfo: { hasCache: boolean; age: number; isStale: boolean };
}

export const useDashboard = (autoRefreshInterval?: number): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardApi.getDashboardData(forceRefresh);
      
      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
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
      await dashboardApi.refreshDashboard();
      await fetchData(true);
    } catch (error) {
      // Error handling is done in the API service
      console.error('Refetch error:', error);
    }
  }, [fetchData]);

  // Check for cached data on mount
  useEffect(() => {
    const cachedData = dashboardApi.getCachedData();
    if (cachedData && cachedData.success) {
      setData(cachedData.data);
      setLastUpdated(new Date());
      setLoading(false);
      
      // Still fetch fresh data in background if cache is stale
      if (dashboardApi.isDataStale()) {
        fetchData(false);
      }
    } else {
      fetchData(false);
    }
  }, [fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      if (!document.hidden && data) { // Only refresh when tab is active and data exists
        fetchData(false);
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchData, data]);

  const cacheInfo = dashboardApi.getCacheInfo();

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    lastUpdated, 
    cacheInfo 
  };
};
