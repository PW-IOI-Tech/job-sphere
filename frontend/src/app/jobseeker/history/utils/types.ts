export interface Filters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string | null;
  profilePicture: string | null;
}

export interface Employer {
  id: number;
  userId: number;
  companyId: number;
  jobTitle: string;
  department: string;
  role: string;
  isActive: boolean;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Job {
  id: number;
  companyId: number;
  employerId: number;
  title: string;
  role: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  noOfOpenings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  employer: Employer;
}

export interface Field {
  id: number;
  jobId: number;
  label: string;
  fieldType: string;
  isRequired: boolean;
  isDefault: boolean;
  order: number;
  options: string[];
}

export interface Response {
  id: number;
  applicationId: number;
  fieldId: number;
  answer: string;
  field: Field;
}

export interface Application {
  id: number;
  jobId: number;
  seekerId: number;
  status: string;
  appliedAt: string;
  updatedAt: string;
  job: Job;
  responses: Response[];
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApplicationHistoryResponse {
  success: boolean;
  data: Application[];
  pagination: Pagination;
}

export interface ApplicationStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: Record<string, number>;
    recent: {
      count: number;
      applications: Application[];
    };
    byCompany: Record<string, number>;
    byRole: Record<string, number>;
  };
}
