import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import { setCredentials, logout } from "@/store/auth.slice";

// Base query that injects the JWT access token from Redux state into every request
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
let isRefreshing = false;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth?.refreshToken;

    if (refreshToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult?.data) {
          const newAccessToken = refreshResult.data?.data?.accessToken;
          if (newAccessToken) {
            // Store the new access token (keep existing refreshToken & user)
            api.dispatch(setCredentials({ token: newAccessToken }));
            // Retry the original request with the new token
            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } catch {
        api.dispatch(logout());
      } finally {
        isRefreshing = false;
      }
    } else if (!refreshToken) {
      // No refresh token stored at all → just clear auth state
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Product",
    "Cart",
    "Order",
    "Admin",
    "User",
    "Review",
    "Category",
    "Brand",
  ],
  endpoints: () => ({}),
});
