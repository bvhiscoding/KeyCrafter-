import { baseApi } from '@/lib/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query({
      query: () => '/admin/products',
      providesTags: ['Admin', 'Product'],
    }),
  }),
});

export const { useGetAdminProductsQuery } = adminApi;
