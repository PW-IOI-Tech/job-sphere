import { Search } from 'lucide-react';
export interface Job {
  id: number;
  title: string;
  role: string;
  description: string;
  requirements?: string;
  location?: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  noOfOpenings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: {
    website: string;
    id: number;
    name: string;
    profilePicture?: string;
    location?: string;
    industry?: string;
    size?: string;
  };
  employer: {
    id: number;
    user: {
      name: string;
    };
  };
  _count: {
    applications: number;
  };
  applications?: Array<{
    id: number;
    status: string;
    appliedAt: string;
  }>;
  formFields?: JobFormField[];
}

export interface JobFormField {
  id: number;
  jobId: number;
  label: string;
  fieldType: string;
  isRequired: boolean;
  isDefault: boolean;
  order: number;
  options: string[];
}


export interface Application {
  id: number;
  jobId: number;
  seekerId: number;
  status: string;
  appliedAt: string;
  updatedAt: string;
  job: Job;
  responses: Array<{
    id: number;
    fieldId: number;
    answer: string;
    field: JobFormField;
  }>;
}

export interface JobStats {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
  interviewedApplications: number;
  acceptedApplications: number;
  totalActiveJobs: number;
}


export interface JobSeekerProfile {
  id: number;
  resume?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profilePicture?: string;
  };
  education: Array<{
    id: number;
    seekerId: number;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
  }>;
  experience: Array<{
    id: number;
    seekerId: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
    location?: string;
  }>;
  projects: Array<{
    id: number;
    seekerId: number;
    title: string;
    description?: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    githubUrl?: string;
    liveUrl?: string;
    isActive: boolean;
  }>;
  preferences?: {
    id: number;
    seekerId: number;
    preferredRoles: string[];
    preferredJobTypes: string[];
    preferredLocations: string[];
    salaryExpectationMin?: number;
    salaryExpectationMax?: number;
    remoteWork: boolean;
    willingToRelocate: boolean;
  };
}

export interface JobFilters {
  location?: string;
  jobType?: string;
  jobTitle?: string;
  minSalary?: number;
  search?: string;
  maxSalary?: number;
  page?: number;
}