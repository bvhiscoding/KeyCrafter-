import { baseApi } from "@/lib/baseApi";
import { buildQueryString } from "@/shared/utils";

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/users${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "User"],
    }),
    getAdminUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["Admin", "User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useUpdateUserStatusMutation,
} = adminUsersApi;
