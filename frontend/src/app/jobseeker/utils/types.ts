// types/dashboard.ts
export interface ApplicationStats {
  accepted: number;
  rejected: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  withdrawn: number;
}

export interface ConversionFunnelItem {
  stage: string;
  count: number;
}

export interface TopJobRole {
  role: string;
  applicationsCount: number;
  totalOpenings: number;
  totalApplicants: number;
  competitionRatio: number;
}

export interface TodayJobPostings {
  count: number;
  yesterdayCount: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TopSkill {
  skill: string;
  count: number;
}

export interface TopCompany {
  id: number;
  name: string;
  industry?: string;
  activeJobsCount?: number;
  totalJobsCount?: number;
}

export interface DashboardData {
  applicationStats: ApplicationStats;
  conversionFunnel: ConversionFunnelItem[];
  topJobRoles: TopJobRole[];
  todayJobPostings: TodayJobPostings;
  topSkills: TopSkill[];
  topCompaniesByActiveJobs: TopCompany[];
  topCompaniesByTotalJobs: TopCompany[];
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
