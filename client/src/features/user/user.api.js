import { baseApi } from "@/lib/base.api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── Wishlist ─────────────────────────────────────── */
    getWishlist: builder.query({
      query: () => "/users/wishlist",
      providesTags: ["User"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    /* ── Profile ──────────────────────────────────────── */
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: "/users/profile", method: "PUT", body }),
      invalidatesTags: ["User", "Auth"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: "/users/change-password", method: "PUT", body }),
    }),

    /* ── Addresses ────────────────────────────────────── */
    addAddress: builder.mutation({
      query: (body) => ({ url: "/users/addresses", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/users/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = userApi;
