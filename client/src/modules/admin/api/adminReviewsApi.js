import { baseApi } from "@/lib/baseApi";
import { buildQueryString } from "@/shared/utils";

export const adminReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReviews: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/reviews${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "Review"],
    }),
    approveReview: builder.mutation({
      query: (id) => ({ url: `/admin/reviews/${id}/approve`, method: "PUT" }),
      invalidatesTags: ["Admin", "Review"],
    }),
    deleteAdminReview: builder.mutation({
      query: (id) => ({ url: `/admin/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Review"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminReviewsQuery,
  useApproveReviewMutation,
  useDeleteAdminReviewMutation,
} = adminReviewsApi;
