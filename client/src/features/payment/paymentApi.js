import { baseApi } from "@/lib/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStripeSession: builder.mutation({
      query: (body) => ({
        url: "/payments/stripe/create-session",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateStripeSessionMutation } = paymentApi;
