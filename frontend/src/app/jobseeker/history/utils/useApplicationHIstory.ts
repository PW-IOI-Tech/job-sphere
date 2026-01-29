import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { applicationHistoryApi } from './applicationHistoryApi';
import { Application, ApplicationStatsResponse, Pagination } from './types';

export const useApplicationHistory = () => {
  // Fixed: Should be Application[] not ApplicationHistoryResponse[]
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fixed: Should be Pagination type instead of unknown
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchApplicationHistory = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: { status?: string; startDate?: string; endDate?: string }
  ) => {
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToastId = toast.loading('Fetching your application history...', {
      duration: Infinity, // Keep it until we dismiss it
    });

    try {
      // Fixed: API returns ApplicationHistoryResponse which contains data: Application[]
      let response;

      if (filters?.status) {
        response = await applicationHistoryApi.getMyApplicationsByStatus(filters.status);
      } else if (filters?.startDate && filters?.endDate) {
        response = await applicationHistoryApi.getMyApplicationsByDateRange(
          filters.startDate,
          filters.endDate
        );
      } else {
        response = await applicationHistoryApi.getMyApplicationHistory({ page, limit });
      }

      // Fixed: response.data is Application[], not ApplicationHistoryResponse[]
      setApplications(response.data);
      setPagination(response.pagination || null);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success(`Loaded ${response.data.length} applications`, {
        duration: 2000,
      });

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Failed to fetch application history');
      setError(errorMessage);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      toast.error(errorMessage, {
        duration: 4000,
        action: {
          label: 'Retry',
          onClick: () => fetchApplicationHistory(page, limit, filters)
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    loading,
    error,
    pagination,
    fetchApplicationHistory,
    refetch: () => fetchApplicationHistory()
  };
};

export const useApplicationStats = () => {
  // Fixed: Should be the data property of ApplicationStatsResponse
  const [stats, setStats] = useState<ApplicationStatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToastId = toast.loading('Loading application statistics...', {
      duration: Infinity,
    });

    try {
      const response = await applicationHistoryApi.getMyApplicationStats();
      // Fixed: Set the data property, not the entire response
      setStats(response.data);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success('Statistics loaded successfully', {
        duration: 2000,
      });

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Failed to fetch application statistics');
      setError(errorMessage);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      toast.error(errorMessage, {
        duration: 4000,
        action: {
          label: 'Retry',
          onClick: () => fetchStats()
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useWithdrawApplication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdrawApplication = useCallback(async (applicationId: number) => {
    setLoading(true);
    setError(null);

    // Show loading toast
    const loadingToastId = toast.loading('Withdrawing application...', {
      duration: Infinity,
    });

    try {
      const response = await applicationHistoryApi.withdrawApplication(applicationId);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success('Application withdrawn successfully', {
        duration: 3000,
        description: 'You can always apply again if you change your mind'
      });
      
      return response;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Failed to withdraw application');
      setError(errorMessage);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      toast.error(errorMessage, {
        duration: 4000,
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { withdrawApplication, loading, error };
};

// Helper function to extract error messages - reduces code duplication
function getErrorMessage(err: unknown, defaultMessage: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object' &&
    'message' in err.response.data &&
    typeof (err.response.data as { message: unknown }).message === 'string'
  ) {
    return (err.response.data as { message: string }).message;
  }
  return defaultMessage;
}
