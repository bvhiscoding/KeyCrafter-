import { baseApi } from '@/lib/base.api';
import { buildQueryString } from '@/shared/utils';

export const adminBrandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBrands: builder.query({
      query: (params = {}) => {
        const qs = buildQueryString(params);
        return `/admin/brands${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Admin', 'Brand'],
    }),
    createBrand: builder.mutation({
      query: (body) => ({ url: '/admin/brands', method: 'POST', body }),
      invalidatesTags: ['Admin', 'Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/brands/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Admin', 'Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({ url: `/admin/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Admin', 'Brand'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = adminBrandsApi;
