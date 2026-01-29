// types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null| undefined;
  location?: string | null;
  profilePicture?: string | null;
  role: 'EMPLOYER' | 'JOBSEEKER';
  createdAt?: string;
  updatedAt?: string;
  employer?: EmployerProfile | null;
}

export interface Company {
  id: number;
  name: string;
  description?: string | null;
  industry?: string | null;
  location?: string | null;
  profilePicture?: string | null;
  website?: string | null;
  size?: string;
  totalEmployees?: number;
  activeJobs?: number;
}

export interface EmployerProfile {
  id: number;
  userId: number;
  companyId?: number | null;
  jobTitle?: string | null;
  department?: string | null;
  role?: 'ADMIN' | 'HR_MANAGER' | 'HIRING_MANAGER' | 'RECRUITER';
  isActive: boolean;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  company?: Company | null;
  totalJobsPosted?: number;
}

export interface ProfileStatus {
  basicDetailsComplete: boolean;
  employerProfileComplete: boolean;
  companySelected: boolean;
  nextStep: string | null;
  completionPercentage: number;
}

export interface ProfileStatusResponse {
  success: boolean;
  data: {
    user: User;
    profileStatus: ProfileStatus;
  };
}

export interface EmployerProfileResponse {
  success: boolean;
  message: string;
  data: EmployerProfile;
}

export interface BasicDetailsUpdate {
  name: string;
  phone: string;
  location: string;
  profilePicture?: string;
}

export interface EmployerProfileFormData {
  jobTitle: string;
  department: string;
  role: 'ADMIN' | 'HR_MANAGER' | 'HIRING_MANAGER' | 'RECRUITER';
}

export interface EmployerProfileUpdatePayload {
  user: {
    name: string;
    phone: string;
    location: string;
    profilePicture: string;
  };
  jobTitle: string;
  department: string;
}

export interface EmployerProfileUpdateResponse {
  success: boolean;
  message?: string;
  data: EmployerProfile;
}
