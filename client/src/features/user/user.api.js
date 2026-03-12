import { baseApi } from "@/lib/base.api";
import {
  setWishlist,
  addWishlistId,
  removeWishlistId,
} from "@/store/wishlist.slice";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── Wishlist ─────────────────────────────────────── */
    getWishlist: builder.query({
      query: () => "/users/wishlist",
      providesTags: ["User"],
      // After a successful fetch, sync the persisted wishlist slice
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const items = Array.isArray(data?.data) ? data.data : [];
          dispatch(setWishlist(items));
        } catch {
          /* ignore — offline or auth error */
        }
      },
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "POST",
      }),
      // Optimistic: update the RTK cache + localStorage slice immediately
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        // 1. Optimistically patch the getWishlist cache
        const patchResult = dispatch(
          userApi.util.updateQueryData("getWishlist", undefined, (draft) => {
            const id = String(productId);
            const already = (draft?.data ?? []).some(
              (item) => String(item._id || item.id || item) === id,
            );
            if (!already) {
              if (!draft.data) draft.data = [];
              // push a minimal placeholder so inWishlist becomes true instantly
              draft.data.push({ _id: id });
            }
          }),
        );
        // 2. Optimistically update the persisted localStorage slice
        dispatch(addWishlistId(productId));

        try {
          await queryFulfilled;
        } catch {
          // Rollback cache if server rejected
          patchResult.undo();
          dispatch(removeWishlistId(productId));
        }
      },
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "DELETE",
      }),
      // Optimistic: remove from cache + localStorage slice immediately
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const id = String(productId);

        // 1. Optimistically patch the getWishlist cache
        const patchResult = dispatch(
          userApi.util.updateQueryData("getWishlist", undefined, (draft) => {
            if (Array.isArray(draft?.data)) {
              draft.data = draft.data.filter(
                (item) => String(item._id || item.id || item) !== id,
              );
            }
          }),
        );
        // 2. Optimistically update the persisted localStorage slice
        dispatch(removeWishlistId(productId));

        try {
          await queryFulfilled;
        } catch {
          // Rollback if server rejected
          patchResult.undo();
          dispatch(addWishlistId(productId));
        }
      },
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
