import { baseApi } from "@/lib/base.api";
import { buildQueryString } from "@/shared/utils";

export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/orders${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "Order"],
    }),
    getAdminOrderById: builder.query({
      query: (id) => `/admin/orders/${id}`,
      providesTags: ["Admin", "Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "Order"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = adminOrdersApi;
