import serverInterfaceService from "./serverInterfaceService";

export type DashboardSubmissionCounts = {
  reading: number;
  writing: number;
  speaking: number;
};

export const dashboardService = {
  fetchSubmissions: (params?: Record<string, any>) => {
    return serverInterfaceService.get<DashboardSubmissionCounts>(
      `/dashboard/submission-count`,
      params
    );
  },
};
