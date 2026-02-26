import { baseApi } from "@/lib/baseApi";
import { buildQueryString } from "@/shared/utils";

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/categories${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "Category"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: "/admin/categories", method: "POST", body }),
      invalidatesTags: ["Admin", "Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/admin/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminCategoriesApi;
