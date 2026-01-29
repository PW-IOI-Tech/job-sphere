import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { EmployerApiResponse, EmployerData } from './types';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CachedResponse {
  data: EmployerApiResponse;
  timestamp: number;
}

interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
}

class EmployerDashboardApiService {
  private cache: Map<string, CachedResponse> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private requestTimeout = 30000; // 30 seconds
  private isRefreshing = false;

  private getCacheKey(endpoint: string): string {
    return `employer_dashboard_${endpoint}`;
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(cacheKey: string, data: EmployerApiResponse): void {
    this.cache.set(cacheKey, { 
      data, 
      timestamp: Date.now() 
    });
  }

  private createApiError(error: AxiosError): ApiError {
    if (error.response) {
      const { status, data } = error.response;
      const responseData = data as { message?: string; error?: string };
      
      switch (status) {
        case 400:
          return {
            message: 'Invalid Request',
            statusCode: status,
            details: responseData?.message || 'Bad request parameters'
          };
        case 401:
          return {
            message: 'Authentication Required',
            statusCode: status,
            details: 'Please login to continue'
          };
        case 403:
          return {
            message: 'Access Denied',
            statusCode: status,
            details: 'Insufficient permissions for this resource'
          };
        case 404:
          return {
            message: 'Resource Not Found',
            statusCode: status,
            details: 'Dashboard endpoint not available'
          };
        case 429:
          return {
            message: 'Rate Limit Exceeded',
            statusCode: status,
            details: 'Too many requests, please try again later'
          };
        case 500:
          return {
            message: 'Server Error',
            statusCode: status,
            details: 'Internal server error occurred'
          };
        case 502:
          return {
            message: 'Service Unavailable',
            statusCode: status,
            details: 'Backend service is temporarily unavailable'
          };
        case 503:
          return {
            message: 'Service Maintenance',
            statusCode: status,
            details: 'Service is under maintenance'
          };
        default:
          return {
            message: `HTTP Error ${status}`,
            statusCode: status,
            details: responseData?.message || 'Unknown server error'
          };
      }
    } else if (error.request) {
      return {
        message: 'Network Connection Failed',
        details: 'Unable to reach the server. Please check your internet connection.'
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request Timeout',
        details: 'The request took too long to complete. Please try again.'
      };
    } else {
      return {
        message: 'Request Failed',
        details: error.message || 'An unexpected error occurred'
      };
    }
  }

  private handleAxiosError(error: AxiosError, loadingToastId?: string | number): never {
    const apiError = this.createApiError(error);
    
    if (loadingToastId) {
      toast.error(apiError.message, { 
        id: loadingToastId, 
        description: apiError.details 
      });
    } else {
      toast.error(apiError.message, { 
        description: apiError.details 
      });
    }

    throw new Error(`${apiError.message}: ${apiError.details}`);
  }

  private validateResponse(data: EmployerApiResponse): EmployerApiResponse {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    if (!data.hasOwnProperty('success')) {
      throw new Error('Response missing success field');
    }

    if (!data.success && !data.message) {
      throw new Error('Failed response without error message');
    }

    if (data.success && !data.data) {
      throw new Error('Successful response missing data field');
    }

    return data as EmployerApiResponse;
  }

  async getDashboardData(forceRefresh = false): Promise<EmployerApiResponse> {
    const cacheKey = this.getCacheKey('complete');

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    // Prevent concurrent requests
    if (this.isRefreshing) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (this.isValidCache(cacheKey)) {
        return this.cache.get(cacheKey)!.data;
      }
    }

    this.isRefreshing = true;
    const loadingToastId = toast.loading('Loading employer dashboard...', {
      description: 'Fetching hiring analytics and statistics',
      duration: this.requestTimeout,
    });

    try {
      if (!backendUrl) {
        throw new Error('Backend URL not configured');
      }

      const response = await axios.get(`${backendUrl}/api/employer/dashboard`, {
        withCredentials: true,
        timeout: this.requestTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const validatedData = this.validateResponse(response.data);

      if (!validatedData.success) {
        throw new Error(validatedData.message || 'API returned unsuccessful response');
      }

      // Cache the successful response
      this.setCache(cacheKey, validatedData);

      toast.success('Dashboard loaded successfully', {
        id: loadingToastId,
        description: `${validatedData.data.overview.totalJobs} jobs, ${validatedData.data.overview.totalApplicants} applicants`,
      });

      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, loadingToastId);
      } else {
        toast.error('Unexpected Error', {
          id: loadingToastId,
          description: error instanceof Error ? error.message : 'Unknown error occurred'
        });
        throw error;
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  async refreshDashboard(): Promise<EmployerApiResponse> {
    const toastId = toast.loading('Refreshing dashboard...', {
      description: 'Getting latest analytics data'
    });
    
    try {
      // Clear existing cache before refresh
      this.clearCache();
      const data = await this.getDashboardData(true);
      
      toast.success('Dashboard refreshed', { 
        id: toastId,
        description: 'All data updated successfully'
      });
      
      return data;
    } catch (err) {
      toast.error('Refresh failed', { 
        id: toastId,
        description: err instanceof Error ? err.message : 'Unable to refresh data'
      });
      throw err;
    }
  }

  getCachedData(): EmployerApiResponse | null {
    const key = this.getCacheKey('complete');
    const cached = this.cache.get(key);
    
    if (cached && this.isValidCache(key)) {
      return cached.data;
    }
    
    return null;
  }

  isDataStale(): boolean {
    const key = this.getCacheKey('complete');
    return !this.isValidCache(key);
  }

  getCacheAge(): number | null {
    const key = this.getCacheKey('complete');
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    return Date.now() - cached.timestamp;
  }

  clearCache(): void {
    const clearedCount = this.cache.size;
    this.cache.clear();
    
    if (clearedCount > 0) {
      toast.info('Cache cleared', {
        description: `Removed ${clearedCount} cached entries`
      });
    }
  }

  // Health check method
  async checkApiHealth(): Promise<boolean> {
    try {
      if (!backendUrl) return false;
      
      const response = await axios.get(`${backendUrl}/health`, {
        timeout: 5000,
        withCredentials: true
      });
      
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Get cache statistics for debugging
  getCacheStats() {
    return {
      totalEntries: this.cache.size,
      cacheTimeout: this.cacheTimeout,
      isRefreshing: this.isRefreshing,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        isValid: this.isValidCache(key)
      }))
    };
  }
}

export const employerDashboardApi = new EmployerDashboardApiService();
