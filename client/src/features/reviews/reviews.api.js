import { baseApi } from "@/lib/base.api";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => {
        const search = new URLSearchParams(params).toString();
        return `/products/${productId}/reviews${search ? `?${search}` : ""}`;
      },
      providesTags: ["Review"],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
