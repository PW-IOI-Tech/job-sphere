// services/dashboardApi.ts
import { DashboardApiResponse } from '../utils/types';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

class DashboardApiService {
  private cache: Map<string, { data: DashboardApiResponse; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string): string {
    return `dashboard_${endpoint}`;
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.cacheTimeout;
  }

  private setCache(cacheKey: string, data: DashboardApiResponse): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  private handleAxiosError(error: AxiosError, loadingToastId?: string | number): never {
    let errorMessage = 'An unexpected error occurred';
    let toastDescription = 'Please try again later';

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = 'Bad Request';
          toastDescription = 'Invalid request parameters';
          break;
        case 401:
          errorMessage = 'Authentication Failed';
          toastDescription = 'Please login again to continue';
          break;
        case 403:
          errorMessage = 'Access Denied';
          toastDescription = 'You don\'t have permission to access this resource';
          break;
        case 404:
          errorMessage = 'Resource Not Found';
          toastDescription = 'The requested resource was not found';
          break;
        case 429:
          errorMessage = 'Rate Limit Exceeded';
          toastDescription = 'Too many requests. Please wait and try again';
          break;
        case 500:
          errorMessage = 'Server Error';
          toastDescription = 'Internal server error. Please try again later';
          break;
        case 502:
          errorMessage = 'Service Unavailable';
          toastDescription = 'Service temporarily unavailable';
          break;
        case 503:
          errorMessage = 'Service Unavailable';
          toastDescription = 'Service is temporarily down for maintenance';
          break;
        default:
          errorMessage = `Server Error (${status})`;
          toastDescription = (data as { message?: string })?.message || 'An error occurred on the server';
      }
    } else if (error.request) {
      // Network error - request made but no response received
      errorMessage = 'Network Error';
      toastDescription = 'Unable to connect to server. Check your internet connection';
    } else {
      // Something happened in setting up the request
      errorMessage = 'Request Error';
      toastDescription = error.message || 'Failed to make request';
    }

    // Show error toast
    if (loadingToastId) {
      toast.error(errorMessage, {
        id: loadingToastId,
        description: toastDescription,
        duration: 5000,
      });
    } else {
      toast.error(errorMessage, {
        description: toastDescription,
        duration: 5000,
      });
    }

    throw new Error(`${errorMessage}: ${toastDescription}`);
  }

  async getDashboardData(forceRefresh: boolean = false): Promise<DashboardApiResponse> {
    const cacheKey = this.getCacheKey('complete');
    
    // Check cache first unless force refresh
    if (!forceRefresh && this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    // Show loading toast
    const loadingToastId = toast.loading('Loading dashboard data...', {
      description: 'Fetching your latest analytics and insights',
      duration: 10000, // Keep loading toast for longer
    });

    try {
      const response = await axios.get(`${backendUrl}/api/jobseeker/dashboard`, {
        withCredentials: true,
        timeout: 30000, // 30 seconds timeout
      });

      // Axios automatically handles status codes 200-299 as success
      const data: DashboardApiResponse = response.data;

      // Validate response structure
      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }

      // Cache successful response
      this.setCache(cacheKey, data);
      
      // Success toast
      toast.success('Dashboard loaded successfully', {
        id: loadingToastId,
        description: 'Your analytics data has been updated',
        duration: 3000,
      });
      
      return data;

    } catch (error) {
      console.error('Dashboard API Error:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, loadingToastId);
      } else {
        // Handle non-Axios errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        toast.error('Failed to load dashboard', {
          id: loadingToastId,
          description: errorMessage,
          duration: 5000,
        });
        
        throw new Error(`Dashboard loading failed: ${errorMessage}`);
      }
    }
  }

  // Method to refresh dashboard with user feedback
  async refreshDashboard(): Promise<DashboardApiResponse> {
    const refreshToastId = toast.loading('Refreshing dashboard...', {
      description: 'Getting the latest data for you',
    });

    try {
      const data = await this.getDashboardData(true); // Force refresh
      
      toast.success('Dashboard refreshed successfully', {
        id: refreshToastId,
        description: 'All data has been updated',
        duration: 2000,
      });
      
      return data;
    } catch (error) {
      toast.error('Failed to refresh dashboard', {
        id: refreshToastId,
        description: 'Please try again',
        duration: 4000,
      });
      throw error;
    }
  }

  // Method to get cached data without API call
  getCachedData(): DashboardApiResponse | null {
    const cacheKey = this.getCacheKey('complete');
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }
    return null;
  }

  // Method to check if data is stale
  isDataStale(): boolean {
    const cacheKey = this.getCacheKey('complete');
    return !this.isValidCache(cacheKey);
  }

  // Method to get cache info
  getCacheInfo(): { hasCache: boolean; age: number; isStale: boolean } {
    const cacheKey = this.getCacheKey('complete');
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return { hasCache: false, age: 0, isStale: true };
    }
    
    const age = Date.now() - cached.timestamp;
    const isStale = age >= this.cacheTimeout;
    
    return {
      hasCache: true,
      age: Math.round(age / 1000), // age in seconds
      isStale
    };
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
    toast.info('Cache cleared', {
      description: 'Dashboard data cache has been cleared',
      duration: 2000,
    });
  }

  // Clear specific cache entry
  clearCacheEntry(endpoint: string): void {
    const cacheKey = this.getCacheKey(endpoint);
    this.cache.delete(cacheKey);
  }
}

// Export singleton instance
export const dashboardApi = new DashboardApiService();
