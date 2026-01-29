// utils/profileApi.ts
import axios from 'axios';
import { 
  JobSeekerProfileData, 
  ProfileStatus, 
  BasicDetailsFormData,
  JobSeekerProfileFormData,
  EducationFormData,
  ExperienceFormData,
  ProjectFormData,
  PreferencesFormData
} from './types';
import { showErrorToast } from './toasts';
import { AxiosError,AxiosResponse } from 'axios';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendURL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined in environment variables');
}

const apiClient = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response type definitions
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Enhanced error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show error toast for expected "profile not found" cases
    if (error.response?.data?.message === "Job seeker profile not found" || 
        error.response?.status === 404) {
      return Promise.reject(error);
    }
    
    // Only show error toast if it's not handled by promiseToast
    if (!error.config?.skipGlobalErrorToast) {
      if (error.response?.data?.message) {
        showErrorToast('Error', error.response.data.message);
      } else if (error.message) {
        showErrorToast('Network Error', error.message);
      } else {
        showErrorToast('Error', 'Something went wrong. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);

// Enhanced profile data fetching with better error handling
export const fetchProfileData = async (): Promise<ApiResponse<JobSeekerProfileData>> => {
  try {
    const response: AxiosResponse<ApiResponse<JobSeekerProfileData>> = await apiClient.get('/api/jobseeker/profile');
    return response.data;
  } catch (error: unknown) {
    // First, narrow down the type
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<JobSeekerProfileData>>;

      if (axiosError.response?.status === 404 || axiosError.response?.data?.message === "Job seeker profile not found") {
        return {
          success: false,
          message: "Job seeker profile not found",
          data: {} as JobSeekerProfileData,
        };
      }

      // handle other axios errors here
    }

    // if it's not an axios error, rethrow
    throw error;
  }
};

export const fetchProfileStatus = async (): Promise<ApiResponse<{ user: unknown; profileStatus: ProfileStatus }>> => {
  try {
    const response: AxiosResponse<ApiResponse<{ user: unknown; profileStatus: ProfileStatus }>> =
      await apiClient.get("/api/jobseeker/profile-status");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<{ user: unknown; profileStatus: ProfileStatus }>>;

      if (
        axiosError.response?.status === 404 ||
        axiosError.response?.data?.message === "Job seeker profile not found"
      ) {
        return {
          success: false,
          message: "Job seeker profile not found",
          data: {
            user: null,
            profileStatus: {
              completionPercentage: 0,
              sectionsCompleted: 0,
              totalSections: 6,
              basicDetails: false,
              jobSeekerProfile: false,
              education: false,
              experience: false,
              projects: false,
              preferences: false,
              nextStep: "Complete your basic details",
              isComplete: false,
            },
          },
        };
      }
    }

    // If it's not an Axios error or a handled case, rethrow
    throw error;
  }
};
// Basic details update (User table fields only)
export const updateBasicDetails = async (data: BasicDetailsFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/basic-details', data);
  return response.data;
};

// Enhanced job seeker profile management with create/update logic
export const createJobSeekerProfile = async (data: JobSeekerProfileFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/profile', data);
  return response.data;
};

export const updateJobSeekerProfile = async (data: JobSeekerProfileFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/profile', data);
  return response.data;
};

// Smart job seeker profile handler - creates or updates based on existence
export const saveJobSeekerProfile = async (
  data: JobSeekerProfileFormData,
  profileExists: boolean
): Promise<ApiResponse<unknown>> => {
  if (profileExists) {
    return updateJobSeekerProfile(data);
  } else {
    return createJobSeekerProfile(data);
  }
};

// Rest of the API functions remain the same...
export const addEducation = async (data: EducationFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/education', data);
  return response.data;
};

export const updateEducation = async (id: number, data: EducationFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/education/${id}`);
  return response.data;
};

export const addExperience = async (data: ExperienceFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/experience', data);
  return response.data;
};

export const updateExperience = async (id: number, data: ExperienceFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/experience/${id}`);
  return response.data;
};

export const addProject = async (data:ProjectFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/project', data);
  return response.data;
};

export const updateProject = async (id: number, data: ProjectFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/project/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/project/${id}`);
  return response.data;
};

export const updatePreferences = async (data: PreferencesFormData): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/preferences', data);
  return response.data;
};


