import axios from 'axios';
import { toast } from 'sonner';
import { ApplicationHistoryResponse, ApplicationStatsResponse } from './types';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiClient = axios.create({
  baseURL: `${backendURL}/api/applications`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const applicationHistoryApi = {
  // Get current user's application history (most commonly used)
  getMyApplicationHistory: async (
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApplicationHistoryResponse> => {
    const response = await apiClient.get('/my-history', { params });
    return response.data;
  },

  // Get current user's application statistics
  getMyApplicationStats: async (): Promise<ApplicationStatsResponse> => {
    const response = await apiClient.get('/my-stats');
    return response.data;
  },

  // Get current user's applications by status
  getMyApplicationsByStatus: async (status: string): Promise<ApplicationHistoryResponse> => {
    const response = await apiClient.get(`/my-applications/status/${status}`);
    return response.data;
  },

  // Get current user's applications by date range
  getMyApplicationsByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<ApplicationHistoryResponse> => {
    const response = await apiClient.get('/my-applications/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get single application details
  getApplicationDetails: async (applicationId: number) => {
    const response = await apiClient.get(`/details/${applicationId}`);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (applicationId: number) => {
    const response = await apiClient.put(`/${applicationId}/withdraw`);
    return response.data;
  },
};
