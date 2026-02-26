import { baseApi } from "@/lib/baseApi";
import { buildQueryString } from "@/shared/utils";

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/products${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Admin", "Product"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      invalidatesTags: ["Admin", "Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Product"],
    }),
    uploadProductImages: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Admin", "Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
} = adminProductsApi;
