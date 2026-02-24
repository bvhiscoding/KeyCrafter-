import { baseApi } from '@/lib/baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Admin'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
