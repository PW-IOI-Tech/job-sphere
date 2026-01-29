import axios, {  AxiosResponse } from 'axios';
import { toast } from 'sonner';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendURL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not defined');
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface JobFilters extends PaginationParams {
  role?: string;
  jobType?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  companyId?: string;
  search?: string;
}

// Create axios instance for job endpoints
const jobApiClient = axios.create({
  baseURL: `${backendURL}/api/jobseekers`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Create axios instance for profile endpoints
const profileApiClient = axios.create({
  baseURL: `${backendURL}/api/jobseeker`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptors
[jobApiClient, profileApiClient].forEach(client => {
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      console.error('API Error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Redirect to login if needed
          // window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
});

export class JobSeekerAPI {
  private static async handleRequest<T>(
    requestPromise: Promise<AxiosResponse<ApiResponse<T>>>,
    options: {
      showLoadingToast?: boolean;
      loadingMessage?: string;
      successMessage?: string;
      showSuccessToast?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      showLoadingToast = false,
      loadingMessage = 'Loading...',
      successMessage,
      showSuccessToast = false,
    } = options;

    let toastId: string | number | undefined;

    if (showLoadingToast) {
      toastId = toast.loading(loadingMessage);
    }

    try {
      const response = await requestPromise;
      
      if (toastId) {
        toast.dismiss(toastId);
      }

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      return response.data;
    } catch (error: unknown) {
      if (toastId) {
        toast.dismiss(toastId);
      }

      console.error('API Request Error:', error);
      
      let errorMessage = 'Something went wrong';
      
      if (axios.isAxiosError(error) && error.response?.data) {
        errorMessage = error.response.data.message || 'API request failed';
        toast.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: error.response.data.error || error.message,
        };
      }
      
      errorMessage = 'Network error or server unavailable';
      toast.error(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Profile endpoints
  static async getProfile() {
    return this.handleRequest(
      profileApiClient.get('/profile'),
      {
        showLoadingToast: true,
        loadingMessage: 'Loading your profile...',
      }
    );
  }

  // Job-related endpoints
 static async getJobs(filters: JobFilters = {}, showLoading = false) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return this.handleRequest(
      jobApiClient.get(`/jobs?${params.toString()}`),
      showLoading ? {
        showLoadingToast: true,
        loadingMessage: 'Fetching jobs...',
      } : {}
    );
  }


  static async getJobById(jobId: string) {
    return this.handleRequest(
      jobApiClient.get(`/jobs/${jobId}`),
      {
        showLoadingToast: true,
        loadingMessage: 'Loading job details...',
      }
    );
  }

  static async applyForJob(jobId: string, responses: unknown[]) {
    return this.handleRequest(
      jobApiClient.post(`/jobs/${jobId}/apply`, { responses }),
      {
        showLoadingToast: true,
        loadingMessage: 'Submitting your application...',
        successMessage: 'Application submitted successfully!',
        showSuccessToast: true,
      }
    );
  }

  static async getMyApplications(params: { status?: string } & PaginationParams = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.handleRequest(
      jobApiClient.get(`/applications?${searchParams.toString()}`)
    );
  }

  static async getApplicationById(applicationId: string) {
    return this.handleRequest(
      jobApiClient.get(`/applications/${applicationId}`),
      {
        showLoadingToast: true,
        loadingMessage: 'Loading application details...',
      }
    );
  }

  static async withdrawApplication(applicationId: string) {
    return this.handleRequest(
      jobApiClient.patch(`/applications/${applicationId}/withdraw`),
      {
        showLoadingToast: true,
        loadingMessage: 'Withdrawing application...',
        successMessage: 'Application withdrawn successfully',
        showSuccessToast: true,
      }
    );
  }

  static async getRecommendedJobs(params: PaginationParams = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.handleRequest(
      jobApiClient.get(`/recommendations?${searchParams.toString()}`)
    );
  }

  static async getJobStats() {
    return this.handleRequest(
      jobApiClient.get('/stats'),
      {
        showLoadingToast: true,
        loadingMessage: 'Loading statistics...',
      }
    );
  }
}

export { jobApiClient, profileApiClient };
