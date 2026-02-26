import { baseApi } from "@/lib/baseApi";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── Categories ───────────────────────────────────── */
    getCategories: builder.query({
      query: (params = {}) => {
        const search = new URLSearchParams(params).toString();
        return `/categories${search ? `?${search}` : ""}`;
      },
      providesTags: ["Category"],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/${slug}`,
      providesTags: ["Category"],
    }),

    /* ── Brands ───────────────────────────────────────── */
    getBrands: builder.query({
      query: (params = {}) => {
        const search = new URLSearchParams(params).toString();
        return `/brands${search ? `?${search}` : ""}`;
      },
      providesTags: ["Brand"],
    }),
    getBrandBySlug: builder.query({
      query: (slug) => `/brands/${slug}`,
      providesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBrandsQuery,
  useGetBrandBySlugQuery,
} = catalogApi;
