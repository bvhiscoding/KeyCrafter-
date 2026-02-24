import { baseApi } from '@/lib/baseApi';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
  }),
});

export const { useGetCartQuery } = cartApi;
