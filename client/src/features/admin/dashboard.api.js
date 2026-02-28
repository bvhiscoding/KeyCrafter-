import { baseApi } from "@/lib/base.api";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard/stats",
      providesTags: ["Admin"],
    }),
    getRevenueChart: builder.query({
      query: () => "/admin/dashboard/revenue-chart",
      providesTags: ["Admin"],
    }),
    getTopProducts: builder.query({
      query: () => "/admin/dashboard/top-products",
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
} = dashboardApi;
