import { baseApi } from "@/lib/base.api";

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
