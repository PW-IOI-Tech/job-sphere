// utils/enumMappings.ts

export const JOB_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'CONTRACT', label: 'Contract' }
];

export const JOB_ROLE_OPTIONS = [
  { value: 'SOFTWARE_ENGINEER', label: 'Software Engineer' },
  { value: 'BACKEND_DEVELOPER', label: 'Backend Developer' },
  { value: 'FRONTEND_DEVELOPER', label: 'Frontend Developer' },
  { value: 'FULLSTACK_DEVELOPER', label: 'Fullstack Developer' },
  { value: 'DATA_SCIENTIST', label: 'Data Scientist' },
  { value: 'DATA_ANALYST', label: 'Data Analyst' },
  { value: 'DEVOPS_ENGINEER', label: 'DevOps Engineer' },
  { value: 'CLOUD_ENGINEER', label: 'Cloud Engineer' },
  { value: 'ML_ENGINEER', label: 'ML Engineer' },
  { value: 'AI_ENGINEER', label: 'AI Engineer' },
  { value: 'MOBILE_DEVELOPER', label: 'Mobile Developer' },
  { value: 'ANDROID_DEVELOPER', label: 'Android Developer' },
  { value: 'IOS_DEVELOPER', label: 'iOS Developer' },
  { value: 'UI_UX_DESIGNER', label: 'UI/UX Designer' },
  { value: 'PRODUCT_MANAGER', label: 'Product Manager' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
  { value: 'BUSINESS_ANALYST', label: 'Business Analyst' },
  { value: 'QA_ENGINEER', label: 'QA Engineer' },
  { value: 'TEST_AUTOMATION_ENGINEER', label: 'Test Automation Engineer' },
  { value: 'CYBERSECURITY_ANALYST', label: 'Cybersecurity Analyst' },
  { value: 'NETWORK_ENGINEER', label: 'Network Engineer' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin' },
  { value: 'DATABASE_ADMIN', label: 'Database Admin' },
  { value: 'BLOCKCHAIN_DEVELOPER', label: 'Blockchain Developer' },
  { value: 'GAME_DEVELOPER', label: 'Game Developer' },
  { value: 'TECH_SUPPORT', label: 'Tech Support' },
  { value: 'CONTENT_WRITER', label: 'Content Writer' },
  { value: 'DIGITAL_MARKETER', label: 'Digital Marketer' },
  { value: 'SALES_ASSOCIATE', label: 'Sales Associate' },
  { value: 'HR_MANAGER', label: 'HR Manager' }
];

// Helper functions to get user-friendly labels
export const getJobTypeLabel = (value: string): string => {
  const option = JOB_TYPE_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value.replace(/_/g, ' ');
};

export const getJobRoleLabel = (value: string): string => {
  const option = JOB_ROLE_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value.replace(/_/g, ' ');
};
