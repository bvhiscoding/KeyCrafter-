import { baseApi } from '@/lib/baseApi';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const search = new URLSearchParams(params).toString();
        return `/products${search ? `?${search}` : ''}`;
      },
      providesTags: ['Product'],
    }),
    getProductDetail: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailQuery } = productsApi;
