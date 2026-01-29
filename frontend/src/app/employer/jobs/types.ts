export enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  LOCATION = "LOCATION",
  RESUME_URL = "RESUME_URL",
  FILE = "FILE",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
  YEARS_OF_EXPERIENCE = "YEARS_OF_EXPERIENCE",
}

export type FieldTypeValue = `${FieldType}`;

export interface JobFormField {
  id?: number;
  jobId?: number;
  fieldType: FieldTypeValue;
  label: string;
  isRequired: boolean;
  isDefault?: boolean;
  options?: string[];
  order: number;
}

export interface Job {
  id: number;
  title: string;
  role?: string;
  description: string;
  requirements?: string;
  location?: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  noOfOpenings?: number;
  status: string;
  totalApplications: number;
  createdAt: string;
  updatedAt?: string;
  companyId?: number;
  employerId?: number;
  company?: {
    id: number;
    name: string;
    profilePicture?: string;
    industry?: string;
  };
  _count?: {
    applications: number;
  };
  pendingApplications?: number;
}

export interface JobForm {
  title: string;
  role: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryMin: number | "";
  salaryMax: number | "";
  noOfOpenings: number | "";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JobFormResponse {
  fields: JobFormField[];
}

// Additional utility types for better TypeScript support
export interface ValidationErrors {
  title?: string;
  role?: string;
  description?: string;
  requirements?: string;
  location?: string;
  jobType?: string;
  salaryMin?: string;
  salaryMax?: string;
  noOfOpenings?: string;
  general?: string;
}

export interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface JobCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: JobForm) => void;
  editingJob?: Job | null;
}

export interface JobFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (fields: JobFormField[]) => void;
  existingFields?: JobFormField[] | null;
  jobId?: number | null;
  onDeleteField?: (jobId: number, fieldId: number) => void;
}

// Constants for dropdowns and validation
export const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
] as const;

export const JOB_ROLES = [
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "FULLSTACK_DEVELOPER", label: "Fullstack Developer" },
  { value: "DATA_SCIENTIST", label: "Data Scientist" },
  { value: "DATA_ANALYST", label: "Data Analyst" },
  { value: "DEVOPS_ENGINEER", label: "DevOps Engineer" },
  { value: "CLOUD_ENGINEER", label: "Cloud Engineer" },
  { value: "ML_ENGINEER", label: "ML Engineer" },
  { value: "AI_ENGINEER", label: "AI Engineer" },
  { value: "MOBILE_DEVELOPER", label: "Mobile Developer" },
  { value: "ANDROID_DEVELOPER", label: "Android Developer" },
  { value: "IOS_DEVELOPER", label: "iOS Developer" },
  { value: "UI_UX_DESIGNER", label: "UI/UX Designer" },
  { value: "PRODUCT_MANAGER", label: "Product Manager" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "BUSINESS_ANALYST", label: "Business Analyst" },
  { value: "QA_ENGINEER", label: "QA Engineer" },
  { value: "TEST_AUTOMATION_ENGINEER", label: "Test Automation Engineer" },
  { value: "CYBERSECURITY_ANALYST", label: "Cybersecurity Analyst" },
  { value: "NETWORK_ENGINEER", label: "Network Engineer" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
  { value: "DATABASE_ADMIN", label: "Database Admin" },
  { value: "BLOCKCHAIN_DEVELOPER", label: "Blockchain Developer" },
  { value: "GAME_DEVELOPER", label: "Game Developer" },
  { value: "TECH_SUPPORT", label: "Tech Support" },
  { value: "CONTENT_WRITER", label: "Content Writer" },
  { value: "DIGITAL_MARKETER", label: "Digital Marketer" },
  { value: "SALES_ASSOCIATE", label: "Sales Associate" },
  { value: "HR_MANAGER", label: "HR Manager" },
] as const;

export const FIELD_TYPES = [
  { value: FieldType.TEXT, label: "Text Input" },
  { value: FieldType.NUMBER, label: "Number" },
  { value: FieldType.EMAIL, label: "Email" },
  { value: FieldType.PHONE, label: "Phone" },
  { value: FieldType.LOCATION, label: "Location" },
  { value: FieldType.RESUME_URL, label: "Resume URL" },
  { value: FieldType.FILE, label: "File Upload" },
  { value: FieldType.TEXTAREA, label: "Text Area" },
  { value: FieldType.SELECT, label: "Dropdown" },
  { value: FieldType.MULTISELECT, label: "Multi Select" },
  { value: FieldType.CHECKBOX, label: "Checkbox" },
  { value: FieldType.DATE, label: "Date" },
  { value: FieldType.YEARS_OF_EXPERIENCE, label: "Years of Experience" },
] as const;

// Status color mapping
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Form validation helper
export const validateJobForm = (form: JobForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.title || form.title.trim().length < 3) {
    errors.title = "Job title must be at least 3 characters long";
  }

  if (!form.role) {
    errors.role = "Please select a job role";
  }

  if (!form.description || form.description.trim().length < 20) {
    errors.description = "Job description must be at least 20 characters long";
  }

  if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
    errors.salaryMax = "Maximum salary must be higher than minimum salary";
  }

  if (form.noOfOpenings && (isNaN(Number(form.noOfOpenings)) || Number(form.noOfOpenings) < 1)) {
    errors.noOfOpenings = "Number of openings must be at least 1";
  }

  return errors;
};
