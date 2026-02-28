import { baseApi } from "@/lib/base.api";
import { buildQueryString } from "@/shared/utils";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Public ──────────────────────────────────────────────────────────────
    getBlogs: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/blogs${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Blog"],
    }),

    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: "Blog", id: slug }],
    }),

    getFeaturedBlogs: builder.query({
      query: (limit = 4) => `/blogs/featured?limit=${limit}`,
      providesTags: ["Blog"],
    }),

    getBlogCategories: builder.query({
      query: () => `/blogs/categories`,
      providesTags: ["Blog"],
    }),

    // ── Admin ────────────────────────────────────────────────────────────────
    getAdminBlogs: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/blogs${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "Blog"],
    }),

    getAdminBlogById: builder.query({
      query: (id) => `/admin/blogs/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Blog", id }],
    }),

    createBlog: builder.mutation({
      query: (data) => ({ url: `/admin/blogs`, method: "POST", body: data }),
      invalidatesTags: ["Admin", "Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        "Admin",
        "Blog",
        { type: "Blog", id },
      ],
    }),

    toggleBlogPublish: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}/toggle-publish`,
        method: "PUT",
      }),
      invalidatesTags: ["Admin", "Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({ url: `/admin/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Blog"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetFeaturedBlogsQuery,
  useGetBlogCategoriesQuery,
  useGetAdminBlogsQuery,
  useGetAdminBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useToggleBlogPublishMutation,
  useDeleteBlogMutation,
} = blogApi;
