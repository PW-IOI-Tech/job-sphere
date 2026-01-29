// types/company.ts
export interface Company {
  id: number; // Changed from string to number
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  profilePicture?: string;
  size?: CompanySize;
  foundedYear?: number;
  createdAt?: string;
  updatedAt?: string;
  employeeCount: number;
  activeJobsCount: number;
  myRole: EmployerRole;
  joinedAt: string;
}

export interface CompanySearchResult {
  id: number; // Changed from string to number
  name: string;
  website?: string;
  industry: string;
  location?: string;
  profilePicture?: string;
  size?: CompanySize;
  employeeCount: number;
  activeJobsCount: number;
  _count: {
    employers: number;
    jobs: number;
  };
}

export interface PublicCompany {
  id: number;
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  profilePicture?: string;
  size?: CompanySize;
  foundedYear?: number;
  createdAt: string;
  employeeCount: number;
  activeJobsCount: number;
  recentJobs?: PublicJob[];
}

export interface PublicJob {
  id: number;
  title: string;
  role: string;
  location?: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
}

export interface Employer {
  id: number;
  userId: number;
  companyId: number;
  jobTitle?: string;
  department?: string;
  role: EmployerRole;
  isActive: boolean;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: number;
    name: string;
    industry: string;
    location?: string;
    profilePicture?: string;
    website?: string;
  };
}

export type CompanySize = 
  | 'STARTUP_1_10'
  | 'SMALL_11_50' 
  | 'MEDIUM_51_200'
  | 'LARGE_201_1000'
  | 'ENTERPRISE_1000_PLUS';

export type EmployerRole = 
  | 'ADMIN'
  | 'HR_MANAGER'
  | 'RECRUITER';

export type JobType = 
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'REMOTE';

// Form data types
export interface CompanyCreateData {
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  size?: CompanySize;
  foundedYear?: number;
  profilePicture?: string;
}

export interface CompanyUpdateData {
  name?: string;
  description?: string;
  website?: string;
  profilePicture?: string;
  industry?: string;
  location?: string;
  size?: CompanySize;
  foundedYear?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface CompanySearchResponse {
  companies: CompanySearchResult[];
  query: string;
  total: number;
}

export interface MyCompanyResponse {
  hasCompany: boolean;
  company: Company | null;
}

export interface SelectCompanyResponse {
  employer: Employer;
  company: {
    id: number;
    name: string;
    industry: string;
    location?: string;
    profilePicture?: string;
    website?: string;
  };
}

export interface CreateCompanyResponse {
  company: Company;
  employer: Employer;
}

export interface UpdateCompanyResponse {
  id: number;
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  profilePicture?: string;
  size?: CompanySize;
  foundedYear?: number;
  updatedAt: string;
}

// Component prop types
// export interface CompanyDashboardProps {}

export interface CompanyProfileViewProps {
  company: Company;
  onEdit: () => void;
  onChangeCompany: () => void;
  onCreateNew: () => void;
}

export interface CompanyCreateFormProps {
  onCancel: () => void;
  onSuccess: (company: Company) => void;
  isUpdating?: boolean;
  initialData?: CompanyUpdateData;
}

export interface CompanySearchSelectProps {
  onCancel: () => void;
  onSelect: (company: Company) => void;
  onCreateNew: () => void;
}

export interface CompanyEditFormProps {
  company: Company;
  onCancel: () => void;
  onSuccess: (updatedCompany: Company) => void;
}

// Hook types
export interface UseCompanyReturn {
  company: Company | null;
  loading: boolean;
  error: string | null;
  hasCompany: boolean;
  refetch: () => Promise<void>;
  updateCompany: (data: CompanyUpdateData) => Promise<Company>;
  selectCompany: (companyId: number) => Promise<Company>;
  createCompany: (data: CompanyCreateData) => Promise<Company>;
  searchCompanies: (query: string) => Promise<CompanySearchResult[]>;
}

// Utility types
export type CompanyFormMode = 'create' | 'edit' | 'select';

export interface CompanySizeOption {
  value: CompanySize;
  label: string;
}

export const COMPANY_SIZE_OPTIONS: CompanySizeOption[] = [
  { value: 'STARTUP_1_10', label: 'Startup (1-10)' },
  { value: 'SMALL_11_50', label: 'Small (11-50)' },
  { value: 'MEDIUM_51_200', label: 'Medium (51-200)' },
  { value: 'LARGE_201_1000', label: 'Large (201-1000)' },
  { value: 'ENTERPRISE_1000_PLUS', label: 'Enterprise (1000+)' },
];

// Helper function to format company size
export const formatCompanySize = (size?: CompanySize): string => {
  const option = COMPANY_SIZE_OPTIONS.find(opt => opt.value === size);
  return option?.label || 'Not specified';
};

// Helper function to transform search result to company
export const transformSearchResultToCompany = (
  searchResult: CompanySearchResult, 
  role: EmployerRole = 'RECRUITER'
): Company => ({
  id: searchResult.id,
  name: searchResult.name,
  website: searchResult.website,
  industry: searchResult.industry,
  location: searchResult.location,
  profilePicture: searchResult.profilePicture,
  size: searchResult.size,
  employeeCount: searchResult._count.employers,
  activeJobsCount: searchResult._count.jobs,
  myRole: role,
  joinedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}
