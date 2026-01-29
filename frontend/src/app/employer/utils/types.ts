// types/employer.ts

export interface EmployerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyId: number;
  designation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerCompany {
  id: number;
  name: string;
  industry: string;
  location?: string;
  size?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerJobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  employmentType: "full-time" | "part-time" | "internship" | "contract";
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  deadline?: string;
  status: "active" | "closed" | "draft";
  totalApplicants: number;
}

export interface EmployerApplication {
  id: number;
  applicantId: number;
  jobId: number;
  status: "applied" | "shortlisted" | "interviewed" | "accepted" | "rejected" | "withdrawn";
  appliedAt: string;
  updatedAt: string;
}

// Updated types based on complete API response
export interface DashboardOverview {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  applicantsThisMonth: number;
  shortlistedCandidates: number;
  pendingApplications: number;
  conversionRate: number;
}

export interface ApplicationStatusDistribution {
  status: "PENDING" | "REVIEWING" | "SHORTLISTED" | "INTERVIEWED" | "ACCEPTED" | "REJECTED";
  count: number;
  percentage: number;
}

export interface ApplicationStats {
  statusDistribution: ApplicationStatusDistribution[];
  totalApplications: number;
}

export interface RecentActivity {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhoto: string | null;
  jobTitle: string;
  jobRole: string;
  status: "PENDING" | "REVIEWING" | "SHORTLISTED" | "INTERVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  timeAgo: string;
}

export interface ApplicationsOverTime {
  month: string;
  applications: number;
  monthName: string;
}

export interface TopJobRole {
  role: string;
  totalApplications: number;
  jobCount: number;
}

export interface TopPerformingJob {
  id: number;
  title: string;
  role: string;
  applicationCount: number;
  createdAt: string;
  daysActive: number;
}

export interface HiringTrend {
  month: string;
  hired: number;
  monthName: string;
}

export interface Analytics {
  applicationsOverTime: ApplicationsOverTime[];
  topJobRoles: TopJobRole[];
  topPerformingJobs: TopPerformingJob[];
  hiringTrends: HiringTrend[];
}

export interface Insights {
  averageApplicationsPerJob: number;
  monthlyGrowth: number;
  mostPopularRole: string;
  responseRate: number;
}

export interface EmployerData {
  overview: DashboardOverview;
  applicationStats: ApplicationStats;
  recentActivity: RecentActivity[];
  analytics: Analytics;
  insights: Insights;
}

export interface EmployerApiResponse {
  success: boolean;
  message: string;
  data: EmployerData;
}
